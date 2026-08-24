import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_LOCALE, TRANSLATIONS, isLocale, resolveDeviceLocale, type Locale, type Translations } from "@velvet/shared";
import * as Localization from "expo-localization";
import { getItem, setItem } from "./storage";
import { setCurrentLocale } from "./api";

export const LOCALE_STORAGE_KEY = "velvet_locale";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LocaleContext = createContext<LocaleState | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    getItem(LOCALE_STORAGE_KEY).then((stored) => {
      if (isLocale(stored)) {
        setLocaleState(stored);
        setCurrentLocale(stored);
      } else {
        // First launch, no explicit choice yet -- use the device's language
        // instead of always defaulting to German.
        const deviceLocale = resolveDeviceLocale(Localization.getLocales()[0]?.languageTag);
        setLocaleState(deviceLocale);
        setCurrentLocale(deviceLocale);
      }
    });
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    setCurrentLocale(next);
    setItem(LOCALE_STORAGE_KEY, next).catch(() => {});
  };

  const value: LocaleState = { locale, setLocale, t: TRANSLATIONS[locale] };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
