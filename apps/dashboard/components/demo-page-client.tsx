"use client";

import Link from "next/link";
import { QrCheckinExplainer } from "./qr-checkin-explainer";
import { PremiumMatchExplainer } from "./premium-match-explainer";
import { MultiVenueExplainer } from "./multi-venue-explainer";
import { TrustScoreExplainer } from "./trust-score-explainer";
import { useLocale } from "../lib/locale-context";

const EXPLAINER_NODES: Record<string, React.ReactNode> = {
  "qr-checkin": <QrCheckinExplainer />,
  "premium-match": <PremiumMatchExplainer />,
  "multi-venue": <MultiVenueExplainer />,
  "trust-score": <TrustScoreExplainer />,
};

export function DemoPageClient() {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:px-10">
      <Link href="/" className="text-sm text-gold hover:text-gold-bright">
        ← {t.legal.back}
      </Link>

      <p className="mt-6 text-xs uppercase tracking-[0.18em] text-gold-muted">{t.demo.eyebrow}</p>
      <h1 className="mt-3 font-heading text-3xl text-text">{t.demo.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">{t.demo.intro}</p>

      {t.demo.sections.map((section) => (
        <section key={section.key} className="mt-16 border-t border-border pt-14 first:mt-14 first:border-t-0 first:pt-0">
          <p className="text-xs uppercase tracking-[0.14em] text-gold-muted">{section.eyebrow}</p>
          <h2 className="mt-2 font-heading text-2xl text-text">{section.title}</h2>
          <p className="mt-2 text-sm text-text-muted">{section.subtitle}</p>

          <div className="mt-8">{EXPLAINER_NODES[section.key]}</div>

          <ol className="mt-10 flex flex-col gap-6">
            {section.steps.map((step) => (
              <li key={step.n} className="flex gap-4">
                <span className="shrink-0 font-heading text-xl text-gold-muted">{step.n}</span>
                <div>
                  <h3 className="font-semibold text-text">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <div className="mt-16 border-t border-border pt-10 text-center">
        <Link href="/login" className="inline-block rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition hover:bg-gold-bright">
          {t.landing.ctaLogin}
        </Link>
      </div>
    </div>
  );
}
