"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { StaffLoginResponse, StaffProfile, VenueSummary } from "@velvet/shared";
import { apiFetch } from "./api";

const STORE_KEY = "velvet_dashboard_auth";

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

interface AuthState {
  ready: boolean;
  token: string | null;
  staff: StaffProfile | null;
  login: (email: string, password: string) => Promise<void>;
  selectVenue: (preAuthToken: string, venueId: string) => Promise<void>;
  switchVenue: (venueId: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [staff, setStaff] = useState<StaffProfile | null>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw) as { token: string; staff: StaffProfile };
      setToken(parsed.token);
      setStaff(parsed.staff);
    }
    setReady(true);
  }, []);

  const applySession = (session: { token: string; staff: StaffProfile }) => {
    localStorage.setItem(STORE_KEY, JSON.stringify(session));
    setToken(session.token);
    setStaff(session.staff);
  };

  const login = async (email: string, password: string) => {
    const res = await apiFetch<StaffLoginResponse>("/auth/staff/login", {
      method: "POST",
      body: { email, password },
    });
    if ("needsVenueSelection" in res) {
      throw new NeedsVenueSelectionError(res.venues, res.preAuthToken);
    }
    applySession(res);
  };

  const selectVenue = async (preAuthToken: string, venueId: string) => {
    const res = await apiFetch<{ token: string; staff: StaffProfile }>("/auth/staff/select-venue", {
      method: "POST",
      token: preAuthToken,
      body: { venueId },
    });
    applySession(res);
  };

  const switchVenue = async (venueId: string) => {
    if (!token) return;
    const res = await apiFetch<{ token: string; staff: StaffProfile }>("/auth/staff/switch-venue", {
      method: "POST",
      token,
      body: { venueId },
    });
    applySession(res);
  };

  const logout = () => {
    localStorage.removeItem(STORE_KEY);
    setToken(null);
    setStaff(null);
  };

  const value = useMemo(
    () => ({ ready, token, staff, login, selectVenue, switchVenue, logout }),
    [ready, token, staff]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
