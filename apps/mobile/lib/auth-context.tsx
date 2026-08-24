import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { StaffLoginResponse, StaffProfile, VenueSummary } from "@velvet/shared";
import { apiFetch } from "./api";
import { deleteItem, getItem, setItem } from "./storage";

const STORE_KEY = "velvet_auth";

export interface GuestProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  globalTier: string;
  globalTierLabel: string;
  globalScore: number;
}

export type { StaffProfile };

export class NeedsVenueSelectionError extends Error {
  venues: VenueSummary[];
  preAuthToken: string;

  constructor(venues: VenueSummary[], preAuthToken: string) {
    super("Location auswählen");
    this.venues = venues;
    this.preAuthToken = preAuthToken;
  }
}

type Stored = { token: string; kind: "guest" | "staff"; staffProfile?: StaffProfile };

interface AuthState {
  ready: boolean;
  token: string | null;
  kind: "guest" | "staff" | null;
  guestProfile: GuestProfile | null;
  staffProfile: StaffProfile | null;
  loginGuest: (email: string, password: string) => Promise<void>;
  registerGuest: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  loginStaff: (email: string, password: string) => Promise<void>;
  selectStaffVenue: (preAuthToken: string, venueId: string) => Promise<void>;
  refreshGuestProfile: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

async function persist(data: Stored | null) {
  if (!data) {
    await deleteItem(STORE_KEY);
  } else {
    await setItem(STORE_KEY, JSON.stringify(data));
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [kind, setKind] = useState<"guest" | "staff" | null>(null);
  const [guestProfile, setGuestProfile] = useState<GuestProfile | null>(null);
  const [staffProfile, setStaffProfile] = useState<StaffProfile | null>(null);

  useEffect(() => {
    (async () => {
      const raw = await getItem(STORE_KEY);
      if (raw) {
        const stored: Stored = JSON.parse(raw);
        setToken(stored.token);
        setKind(stored.kind);
        if (stored.kind === "staff" && stored.staffProfile) {
          setStaffProfile(stored.staffProfile);
        } else if (stored.kind === "guest") {
          try {
            const profile = await apiFetch<GuestProfile>("/users/me", { token: stored.token });
            setGuestProfile(profile);
          } catch {
            await persist(null);
            setToken(null);
            setKind(null);
          }
        }
      }
      setReady(true);
    })();
  }, []);

  const loginGuest = async (email: string, password: string) => {
    const { token: newToken } = await apiFetch<{ token: string }>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    const profile = await apiFetch<GuestProfile>("/users/me", { token: newToken });
    await persist({ token: newToken, kind: "guest" });
    setToken(newToken);
    setKind("guest");
    setGuestProfile(profile);
  };

  const registerGuest: AuthState["registerGuest"] = async (data) => {
    // No session token comes back here -- the account can't log in until the
    // verification email is confirmed (see /auth/verify-email).
    await apiFetch<{ requiresVerification: true }>("/auth/register", {
      method: "POST",
      body: data,
    });
  };

  const resendVerification = async (email: string) => {
    await apiFetch("/auth/resend-verification", { method: "POST", body: { email } });
  };

  const loginStaff = async (email: string, password: string) => {
    const res = await apiFetch<StaffLoginResponse>("/auth/staff/login", {
      method: "POST",
      body: { email, password },
    });
    if ("needsVenueSelection" in res) {
      throw new NeedsVenueSelectionError(res.venues, res.preAuthToken);
    }
    await persist({ token: res.token, kind: "staff", staffProfile: res.staff });
    setToken(res.token);
    setKind("staff");
    setStaffProfile(res.staff);
  };

  const selectStaffVenue = async (preAuthToken: string, venueId: string) => {
    const { token: newToken, staff } = await apiFetch<{ token: string; staff: StaffProfile }>(
      "/auth/staff/select-venue",
      { method: "POST", token: preAuthToken, body: { venueId } }
    );
    await persist({ token: newToken, kind: "staff", staffProfile: staff });
    setToken(newToken);
    setKind("staff");
    setStaffProfile(staff);
  };

  const refreshGuestProfile = async () => {
    if (!token || kind !== "guest") return;
    const profile = await apiFetch<GuestProfile>("/users/me", { token });
    setGuestProfile(profile);
  };

  const logout = async () => {
    await persist(null);
    setToken(null);
    setKind(null);
    setGuestProfile(null);
    setStaffProfile(null);
  };

  const deleteAccount = async () => {
    if (!token || kind !== "guest") return;
    await apiFetch("/users/me", { method: "DELETE", token });
    await logout();
  };

  const value = useMemo(
    () => ({
      ready,
      token,
      kind,
      guestProfile,
      staffProfile,
      loginGuest,
      registerGuest,
      resendVerification,
      loginStaff,
      selectStaffVenue,
      refreshGuestProfile,
      deleteAccount,
      logout,
    }),
    [ready, token, kind, guestProfile, staffProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
