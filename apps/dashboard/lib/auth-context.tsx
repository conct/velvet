"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
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

interface Session {
  token: string;
  staff: StaffProfile;
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

// The signed-in session lives in localStorage, i.e. outside React. Reading it
// in an effect and calling setState renders the app once as signed out and
// then again as signed in -- a cascading render, and the reason a separate
// `ready` flag was needed to keep the layout from bouncing to /login in
// between. Both are read through useSyncExternalStore instead: `ready` is
// simply "are we past hydration", since that is exactly when the stored
// session becomes readable.
const listeners = new Set<() => void>();

// getSnapshot must return the same reference until the session actually
// changes, so the parsed session is held in memory rather than re-parsed on
// every render.
let loaded = false;
let session: Session | null = null;

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function getSession(): Session | null {
  if (!loaded) {
    loaded = true;
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      session = raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      // Unreadable or unparseable storage means "not signed in". This runs
      // during render, so throwing here would take the whole dashboard down.
      session = null;
    }
  }
  return session;
}

function getServerSession(): Session | null {
  return null;
}

function getReady() {
  return true;
}

function getServerReady() {
  return false;
}

function setSession(next: Session | null) {
  loaded = true;
  session = next;
  if (next) window.localStorage.setItem(STORE_KEY, JSON.stringify(next));
  else window.localStorage.removeItem(STORE_KEY);
  for (const listener of listeners) listener();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const ready = useSyncExternalStore(subscribe, getReady, getServerReady);
  const current = useSyncExternalStore(subscribe, getSession, getServerSession);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiFetch<StaffLoginResponse>("/auth/staff/login", {
      method: "POST",
      body: { email, password },
    });
    if ("needsVenueSelection" in res) {
      throw new NeedsVenueSelectionError(res.venues, res.preAuthToken);
    }
    setSession(res);
  }, []);

  const selectVenue = useCallback(async (preAuthToken: string, venueId: string) => {
    const res = await apiFetch<Session>("/auth/staff/select-venue", {
      method: "POST",
      token: preAuthToken,
      body: { venueId },
    });
    setSession(res);
  }, []);

  const switchVenue = useCallback(
    async (venueId: string) => {
      if (!current) return;
      const res = await apiFetch<Session>("/auth/staff/switch-venue", {
        method: "POST",
        token: current.token,
        body: { venueId },
      });
      setSession(res);
    },
    [current]
  );

  const logout = useCallback(() => setSession(null), []);

  const value = useMemo<AuthState>(
    () => ({
      ready,
      token: current?.token ?? null,
      staff: current?.staff ?? null,
      login,
      selectVenue,
      switchVenue,
      logout,
    }),
    [ready, current, login, selectVenue, switchVenue, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
