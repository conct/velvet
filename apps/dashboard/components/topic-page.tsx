"use client";

import Link from "next/link";
import { useLocale } from "../lib/locale-context";

/**
 * Shape shared by every topic page in the i18n file. Kept structural rather
 * than importing one page's type, so a new topic only needs its own block of
 * copy -- no second place to update.
 */
export interface TopicContent {
  eyebrow: string;
  title: string;
  intro: string;
  faq: { q: string; a: string[] }[];
  ctaHeading: string;
  ctaBody: string;
  ctaButton: string;
}

/** Long-form page that answers one operator question and ends at the form. */
export function TopicPage({ content }: { content: TopicContent }) {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:px-10">
      <Link href="/" className="text-sm text-gold hover:text-gold-bright">
        ← {t.legal.back}
      </Link>

      <p className="mt-6 text-xs uppercase tracking-[0.18em] text-gold-muted">{content.eyebrow}</p>
      <h1 className="mt-3 font-heading text-3xl text-text">{content.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">{content.intro}</p>

      <div className="mt-12 flex flex-col gap-10">
        {content.faq.map((item) => (
          <section key={item.q}>
            <h2 className="font-heading text-lg text-gold">{item.q}</h2>
            <div className="mt-2 flex flex-col gap-2">
              {item.a.map((paragraph, i) => (
                <p key={i} className="text-sm leading-relaxed text-text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-14 rounded border border-gold-muted bg-surface-raised px-6 py-6">
        <h2 className="font-heading text-lg text-text">{content.ctaHeading}</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{content.ctaBody}</p>
        <Link
          href="/location-anmelden"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-medium tracking-wide text-background transition hover:bg-gold-bright"
        >
          {content.ctaButton}
        </Link>
      </section>
    </div>
  );
}
