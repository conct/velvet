"use client";

import Link from "next/link";
import { Card } from "./ui";
import { useLocale } from "../lib/locale-context";

export function MakingOfClient() {
  const { t } = useLocale();
  const m = t.makingOf;
  const totalCommits = m.sessions.reduce((sum, s) => sum + s.commits, 0);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:px-10">
      <Link href="/" className="text-sm text-gold hover:text-gold-bright">
        ← {t.legal.back}
      </Link>

      <p className="mt-6 text-xs uppercase tracking-[0.18em] text-gold-muted">{m.eyebrow}</p>
      <h1 className="mt-3 font-heading text-3xl text-text">{m.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">{m.intro}</p>

      <Card className="mt-10 text-center">
        <div className="text-xs uppercase tracking-wider text-text-muted">{m.devTimeLabel}</div>
        <div className="mt-2 font-heading text-5xl text-gold-bright">{m.devTimeValue}</div>
        <div className="mt-2 text-sm text-text-muted">{m.devTimeRange}</div>
      </Card>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Card className="text-center">
          <div className="font-heading text-2xl text-text">{totalCommits}</div>
          <div className="mt-1 text-xs uppercase tracking-wider text-text-muted">{m.commitsLabel}</div>
        </Card>
        <Card className="text-center">
          <div className="font-heading text-2xl text-text">3</div>
          <div className="mt-1 text-xs uppercase tracking-wider text-text-muted">{m.subsystemsLabel}</div>
        </Card>
      </div>

      <section className="mt-10">
        <h2 className="font-heading text-lg text-gold">{m.workBlocksHeading}</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-border">
          {m.sessions.map((s, i) => (
            <div
              key={s.range}
              className={`flex items-center justify-between px-6 py-3 text-sm ${
                i > 0 ? "border-t border-border" : ""
              }`}
            >
              <span className="text-text">{s.range}</span>
              <span className="text-text-muted">
                {s.note ?? `${s.commits} ${s.commits === 1 ? m.commitSingular : m.commitPlural}`}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-lg text-gold">{m.methodologyHeading}</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{m.methodologyBody}</p>
      </section>
    </div>
  );
}
