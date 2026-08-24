"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { tierColors } from "@velvet/shared";
import { Avatar, Button, Card, TierBadge } from "./ui";
import { QrCheckinExplainer } from "./qr-checkin-explainer";
import { PremiumMatchExplainer } from "./premium-match-explainer";
import { MultiVenueExplainer } from "./multi-venue-explainer";
import { TrustScoreExplainer } from "./trust-score-explainer";
import { useAuth } from "../lib/auth-context";
import { useLocale } from "../lib/locale-context";
import { LanguageSwitcher } from "./language-switcher";

function AppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="7" y="2" width="10" height="20" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="11" y1="18" x2="13" y2="18" strokeLinecap="round" />
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="10 17 15 12 10 7" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="15" y1="12" x2="3" y2="12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// One short looping animation per use case, in the same order as
// `t.landing.explainerTabs` — this list drives the tabbed "How it works"
// section below and the detailed breakdown on /demo.
const EXPLAINER_NODES = [
  { key: "qr-checkin", node: <QrCheckinExplainer /> },
  { key: "premium-match", node: <PremiumMatchExplainer /> },
  { key: "multi-venue", node: <MultiVenueExplainer /> },
  { key: "trust-score", node: <TrustScoreExplainer /> },
];

const DASH_PREVIEW = [
  { name: "Jana Berg", tier: "VIP", score: "4.70" },
  { name: "Timo König", tier: "TRUSTED", score: "4.10" },
  { name: "L. Nowak", tier: "WATCH", score: "2.30" },
];

function BenefitList({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.title} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
          <span>
            <b className="font-semibold text-text">{item.title}</b>{" "}
            <span className="text-text-muted">{item.body}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function LandingPageClient() {
  const router = useRouter();
  const { ready, token } = useAuth();
  const { t } = useLocale();
  const [showMobileOnlyNotice, setShowMobileOnlyNotice] = useState(false);
  const [activeExplainer, setActiveExplainer] = useState(0);

  useEffect(() => {
    if (ready && token) router.replace("/overview");
  }, [ready, token, router]);

  if (!ready || token) return null;

  return (
    <div>
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/85 px-6 py-4 backdrop-blur md:px-10">
        <span className="font-heading text-lg tracking-[0.2em] text-gold">VELVET</span>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <a
            href="https://web.velvet-network.app"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden"
          >
            <button
              aria-label="App"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gold text-gold transition hover:bg-gold/10"
            >
              <AppIcon />
            </button>
          </a>
          <a
            href="https://web.velvet-network.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex md:hidden"
          >
            <Button variant="outline">App</Button>
          </a>
          <Button variant="outline" className="hidden md:inline-flex" onClick={() => setShowMobileOnlyNotice(true)}>
            App
          </Button>
          <Link href="/login" className="sm:hidden">
            <button
              aria-label={t.landing.ctaLogin}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-background transition hover:bg-gold-bright"
            >
              <LoginIcon />
            </button>
          </Link>
          <Link href="/login" className="hidden sm:inline-flex">
            <Button>{t.landing.ctaLogin}</Button>
          </Link>
        </div>
      </header>

      {showMobileOnlyNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
          onClick={() => setShowMobileOnlyNotice(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-heading text-lg text-gold">{t.landing.mobileOnlyTitle}</p>
            <p className="mt-3 text-sm text-text-muted">{t.landing.mobileOnlyBody}</p>
            <Button className="mt-6" onClick={() => setShowMobileOnlyNotice(false)}>
              {t.landing.mobileOnlyConfirm}
            </Button>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-6 md:px-10">
        {/* Hero */}
        <section className="grid gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:py-24">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gold-muted">{t.landing.heroEyebrow}</p>
            <h1 className="mt-4 font-heading text-5xl leading-[0.95] text-text md:text-6xl">
              VEL<span className="italic text-gold">V</span>ET
            </h1>
            <p className="mt-4 font-heading text-xl italic text-gold-bright">{t.landing.tagline}</p>
            <p className="mt-5 max-w-md text-text-muted">{t.landing.heroBody}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login">
                <Button>{t.landing.ctaLogin}</Button>
              </Link>
              <span className="self-center text-xs text-text-muted">{t.landing.ctaForTeam}</span>
            </div>
          </div>

          <Card className="self-center">
            <div className="flex items-center justify-between border-b border-border pb-3 text-xs uppercase tracking-wider text-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                {t.landing.heroCardVerified}
              </span>
              <span>Noir Club</span>
            </div>
            <div className="flex items-center gap-4 py-4">
              <Avatar name="Jana Berg" size={52} />
              <div>
                <div className="font-heading text-lg text-text">Jana Berg</div>
                <TierBadge tier="VIP" size="sm" />
              </div>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-xs text-text-muted">
              <span>{t.landing.heroCardLocations}</span>
              <span>{t.landing.heroCardScore}</span>
            </div>
          </Card>
        </section>

        {/* Prinzip */}
        <section className="border-t border-border py-16">
          <p className="text-xs uppercase tracking-[0.18em] text-gold-muted">{t.landing.principleEyebrow}</p>
          <h2 className="mt-3 max-w-lg font-heading text-3xl text-text">{t.landing.principleTitle}</h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
            {t.landing.flowSteps.map((step) => (
              <div key={step.n} className="flex flex-col gap-2 bg-surface p-6">
                <span className="text-xs tracking-wide text-gold-muted">{step.n}</span>
                <h3 className="font-semibold text-text">{step.title}</h3>
                <p className="text-sm text-text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works — one animation per use case, tabbed */}
        <section className="border-t border-border py-16">
          <p className="text-xs uppercase tracking-[0.18em] text-gold-muted">{t.landing.howEyebrow}</p>
          <h2 className="mt-3 max-w-lg font-heading text-3xl text-text">{t.landing.howTitle}</h2>

          <div className="mt-8 flex flex-wrap gap-2">
            {t.landing.explainerTabs.map((item, i) => (
              <button
                key={item.tabLabel}
                type="button"
                onClick={() => setActiveExplainer(i)}
                className={`rounded-full border px-4 py-2 text-xs font-medium tracking-wide transition ${
                  i === activeExplainer
                    ? "border-gold bg-gold text-background"
                    : "border-border text-text-muted hover:border-gold-muted hover:text-text"
                }`}
              >
                {item.tabLabel}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.14em] text-gold-muted">
              {t.landing.explainerTabs[activeExplainer].eyebrow}
            </p>
            <h3 className="mt-2 font-heading text-xl text-text">{t.landing.explainerTabs[activeExplainer].title}</h3>
            <div className="mt-6">{EXPLAINER_NODES[activeExplainer].node}</div>
          </div>

          <Link href="/demo" className="mt-8 inline-block text-sm text-gold hover:text-gold-bright">
            {t.landing.demoLink}
          </Link>
        </section>

        {/* Für Gäste */}
        <section className="grid items-center gap-10 border-t border-border py-16 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gold-muted">{t.landing.guestsEyebrow}</p>
            <h3 className="mt-3 font-heading text-2xl text-text">{t.landing.guestsTitle}</h3>
            <p className="mt-3 text-text-muted">{t.landing.guestsBody}</p>
            <div className="mt-6">
              <BenefitList items={t.landing.guestsBenefits} />
            </div>
          </div>
          <Card>
            <p className="text-xs text-text-muted">{t.landing.guestsWelcomeBack}</p>
            <p className="mt-1 font-heading text-2xl text-text">Jana</p>
            <div className="mt-4 flex items-center gap-3">
              <Avatar name="Jana" size={44} />
              <TierBadge tier="VIP" size="sm" />
            </div>
            <div className="mt-4 rounded-xl border border-border bg-surface-raised p-4">
              <p className="text-xs text-text-muted">{t.landing.guestsGlobalStatus}</p>
              <p className="mt-1 font-heading text-xl text-gold-bright">4.7 / 5.0</p>
              <p className="mt-2 text-sm text-text-muted">{t.landing.guestsBenefitText}</p>
            </div>
          </Card>
        </section>

        {/* Für Türsteher & Security */}
        <section className="grid items-center gap-10 border-t border-border py-16 md:grid-cols-2 md:gap-16">
          <Card className="order-2 md:order-1">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {t.landing.staffScanDetected}
            </div>
            <div className="mt-4 flex items-center gap-3 border-b border-border pb-4">
              <Avatar name="Jana Berg" size={48} />
              <div>
                <div className="font-heading text-lg text-text">Jana Berg</div>
                <div className="text-xs text-text-muted">VIP · Score 4.7 · 12 {t.landing.staffVisitsSuffix}</div>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="uppercase tracking-wide text-text-muted">{t.landing.staffLocationsLabel}</dt>
                <dd className="mt-0.5 text-text">{t.landing.staffLocationsValue}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-wide text-text-muted">{t.landing.staffLastVisitLabel}</dt>
                <dd className="mt-0.5 text-text">Velvet Lounge HH</dd>
              </div>
              <div>
                <dt className="uppercase tracking-wide text-text-muted">{t.landing.staffLocalStatusLabel}</dt>
                <dd className="mt-0.5 text-text">{t.landing.staffLocalStatusValue}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-wide text-text-muted">{t.landing.staffTraitsLabel}</dt>
                <dd className="mt-0.5 text-text">{t.landing.staffTraitsValue}</dd>
              </div>
            </dl>
            <div className="mt-4 rounded-lg border border-gold-muted px-3 py-2 text-xs text-gold-bright">
              {t.landing.staffNoIncidents}
            </div>
          </Card>
          <div className="order-1 md:order-2">
            <p className="text-xs uppercase tracking-[0.18em] text-gold-muted">{t.landing.staffEyebrow}</p>
            <h3 className="mt-3 font-heading text-2xl text-text">{t.landing.staffTitle}</h3>
            <p className="mt-3 text-text-muted">{t.landing.staffBody}</p>
            <div className="mt-6">
              <BenefitList items={t.landing.staffBenefits} />
            </div>
          </div>
        </section>

        {/* Für Betreiber */}
        <section className="grid items-center gap-10 border-t border-border py-16 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gold-muted">{t.landing.ownersEyebrow}</p>
            <h3 className="mt-3 font-heading text-2xl text-text">{t.landing.ownersTitle}</h3>
            <p className="mt-3 text-text-muted">{t.landing.ownersBody}</p>
            <div className="mt-6">
              <BenefitList items={t.landing.ownersBenefits} />
            </div>
          </div>
          <Card className="p-0">
            <p className="px-6 pt-5 font-heading text-lg text-text">{t.landing.ownersRecentCheckins}</p>
            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-text-muted">
                  <th className="border-t border-border px-6 py-2 text-left font-medium">{t.landing.ownersColGuest}</th>
                  <th className="border-t border-border px-3 py-2 text-left font-medium">{t.landing.ownersColStatus}</th>
                  <th className="border-t border-border px-6 py-2 text-right font-medium">{t.landing.ownersColScore}</th>
                </tr>
              </thead>
              <tbody>
                {DASH_PREVIEW.map((row) => (
                  <tr key={row.name}>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={row.name} size={26} />
                        <span className="text-text">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <TierBadge tier={row.tier} size="sm" />
                    </td>
                    <td className="px-6 py-3 text-right tabular-nums text-text-muted">{row.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="h-4" />
          </Card>
        </section>

        {/* Status-Pfad */}
        <section className="border-t border-border py-16">
          <p className="text-xs uppercase tracking-[0.18em] text-gold-muted">{t.landing.statusEyebrow}</p>
          <h2 className="mt-3 max-w-lg font-heading text-3xl text-text">{t.landing.statusTitle}</h2>
          <p className="mt-2 max-w-lg text-text-muted">{t.landing.statusBody}</p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-border">
            {t.landing.tierPath.map((row, i) => (
              <div
                key={row.tier}
                className={`grid grid-cols-1 items-center gap-2 px-6 py-4 sm:grid-cols-[160px_1fr] sm:gap-6 ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <span
                  className="inline-flex w-fit items-center gap-2 text-sm font-medium"
                  style={{ color: tierColors[row.tier] }}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: tierColors[row.tier] }} />
                  {t.tiers[row.tier as keyof typeof t.tiers]}
                </span>
                <p className="text-sm text-text-muted">{row.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing */}
        <section className="border-t border-border py-20 text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-gold-muted">{t.landing.closingEyebrow}</p>
          <h2 className="mt-3 font-heading text-3xl text-text">{t.landing.closingTitle}</h2>
          <p className="mt-2 font-heading text-lg italic text-gold-bright">{t.landing.tagline}</p>
          <div className="mt-8">
            <Link href="/login">
              <Button>{t.landing.ctaLogin}</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="flex flex-col items-center gap-2 border-t border-border px-6 py-6 text-center text-xs text-text-muted md:px-10">
        <span>{t.landing.footerTagline}</span>
        <span className="flex gap-4">
          <Link href="/impressum" className="hover:text-text">
            {t.landing.footerImpressum}
          </Link>
          <Link href="/datenschutz" className="hover:text-text">
            {t.landing.footerDatenschutz}
          </Link>
          <Link href="/werbematerial" className="hover:text-text">
            {t.landing.footerWerbematerial}
          </Link>
          <Link href="/location-anmelden" className="hover:text-text">
            {t.landing.footerApply}
          </Link>
        </span>
      </footer>
    </div>
  );
}
