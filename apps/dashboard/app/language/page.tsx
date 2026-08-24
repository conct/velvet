"use client";

import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_FLAGS, LOCALE_LABELS } from "@velvet/shared";
import { Heading } from "../../components/ui";
import { useLocale } from "../../lib/locale-context";

export default function LanguagePage() {
  const router = useRouter();
  const { locale, setLocale, t } = useLocale();

  const choose = (next: (typeof LOCALES)[number]) => {
    setLocale(next);
    router.back();
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <button
        onClick={() => router.back()}
        className="fixed left-4 top-4 flex items-center gap-1.5 text-sm text-text-muted hover:text-text md:left-8 md:top-8"
      >
        <span aria-hidden>←</span> {t.login.back}
      </button>

      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
        <Heading className="text-xl">{t.languagePage.title}</Heading>
        <p className="mt-1 text-sm text-text-muted">{t.languagePage.subtitle}</p>

        <div className="mt-6 flex flex-col gap-2">
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => choose(l)}
              aria-current={locale === l}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition ${
                locale === l
                  ? "border-gold text-gold bg-surface-raised"
                  : "border-border text-text hover:border-gold-muted hover:text-gold"
              }`}
            >
              <span className="text-lg leading-none">{LOCALE_FLAGS[l]}</span>
              {LOCALE_LABELS[l]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
