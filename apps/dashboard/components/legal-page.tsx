"use client";

import Link from "next/link";
import type { LegalSection } from "@velvet/shared";
import { useLocale } from "../lib/locale-context";

export function LegalPage({ title, sections }: { title: string; sections: LegalSection[] }) {
  const { t } = useLocale();
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:px-10">
      <Link href="/" className="text-sm text-gold hover:text-gold-bright">
        ← {t.legal.back}
      </Link>
      <h1 className="mt-6 font-heading text-3xl text-text">{title}</h1>
      <div className="mt-10 flex flex-col gap-8">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-heading text-lg text-gold">{section.heading}</h2>
            <div className="mt-2 flex flex-col gap-2">
              {section.paragraphs.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-text-muted">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
