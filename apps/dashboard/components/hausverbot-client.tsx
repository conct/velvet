"use client";

import Link from "next/link";
import { useLocale } from "../lib/locale-context";

export function HausverbotClient() {
  const { t } = useLocale();
  const h = t.pages.hausverbot;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:px-10">
      <Link href="/" className="text-sm text-gold hover:text-gold-bright">
        ← {t.legal.back}
      </Link>

      <p className="mt-6 text-xs uppercase tracking-[0.18em] text-gold-muted">{h.eyebrow}</p>
      <h1 className="mt-3 font-heading text-3xl text-text">{h.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">{h.intro}</p>

      <div className="mt-12 flex flex-col gap-10">
        {h.faq.map((item) => (
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
        <h2 className="font-heading text-lg text-text">{h.ctaHeading}</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{h.ctaBody}</p>
        <Link
          href="/location-anmelden"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-medium tracking-wide text-background transition hover:bg-gold-bright"
        >
          {h.ctaButton}
        </Link>
      </section>
    </div>
  );
}
