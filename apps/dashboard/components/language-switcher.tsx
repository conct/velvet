"use client";

import Link from "next/link";
import { LOCALE_FLAGS, LOCALE_LABELS } from "@velvet/shared";
import { useLocale } from "../lib/locale-context";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale } = useLocale();

  return (
    <Link
      href="/language"
      aria-label="Change language"
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-gold text-sm text-gold transition hover:bg-gold/10 sm:h-auto sm:w-auto sm:px-5 sm:py-2.5 sm:font-medium sm:tracking-wide ${className}`}
    >
      <span className="sm:hidden">{LOCALE_FLAGS[locale]}</span>
      <span className="hidden sm:inline">{LOCALE_LABELS[locale]}</span>
    </Link>
  );
}
