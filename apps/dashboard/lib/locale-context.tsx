"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { DEFAULT_LOCALE, TRANSLATIONS, isLocale, resolveDeviceLocale, type Locale, type Translations } from "@velvet/shared";
import { LOCALE_STORAGE_KEY } from "./api";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LocaleContext = createContext<LocaleState | null>(null);

// The chosen locale lives in localStorage, i.e. outside React. Reading it in
// an effect and calling setState renders the whole tree once in German and
// then immediately again in the real locale; useSyncExternalStore lets React
// read the stored value while rendering, and still fall back to the German
// default for the server-rendered HTML so hydration matches.
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function getSnapshot(): Locale {
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode, blocked site data). This runs
    // during render now, so a throw here would take the whole page down --
    // fall through to the browser language instead.
  }
  if (isLocale(stored)) return stored;
  // No explicit choice yet -- use the browser's language instead of always
  // defaulting to German.
  return resolveDeviceLocale(window.navigator.language);
}

function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLocale = useCallback((next: Locale) => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    for (const listener of listeners) listener();
  }, []);

  const value = useMemo<LocaleState>(
    () => ({ locale, setLocale, t: TRANSLATIONS[locale] }),
    [locale, setLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
