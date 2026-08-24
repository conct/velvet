"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_LOCALE, TRANSLATIONS, isLocale, resolveDeviceLocale, type Locale, type Translations } from "@velvet/shared";
import { LOCALE_STORAGE_KEY } from "./api";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LocaleContext = createContext<LocaleState | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) {
      setLocaleState(stored);
    } else {
      // First visit, no explicit choice yet -- use the browser's language
      // instead of always defaulting to German.
      setLocaleState(resolveDeviceLocale(window.navigator.language));
    }
  }, []);

  const setLocale = (next: Locale) => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    setLocaleState(next);
  };

  const value: LocaleState = { locale, setLocale, t: TRANSLATIONS[locale] };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
