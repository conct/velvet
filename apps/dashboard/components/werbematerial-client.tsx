"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "./ui";
import { useLocale } from "../lib/locale-context";
import { withBold } from "../lib/with-bold";

export function WerbematerialClient() {
  const { t } = useLocale();
  const w = t.pages.werbematerial;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-10">
      <Link href="/" className="text-sm text-gold hover:text-gold-bright">
        ← {t.legal.back}
      </Link>

      <p className="mt-6 text-xs uppercase tracking-[0.18em] text-gold-muted">{w.eyebrow}</p>
      <h1 className="mt-3 font-heading text-3xl text-text">{w.title}</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-muted">{w.intro}</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {w.downloads.map((d) => (
          <Card key={d.title} className="flex flex-col p-0 overflow-hidden">
            <div className="border-b border-border bg-background">
              <Image
                src={d.thumb}
                alt={`${w.previewAlt}: ${d.title}`}
                width={d.thumbWidth}
                height={d.thumbHeight}
                className="w-full h-auto"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-heading text-lg text-text">{d.title}</h2>
                <span className="shrink-0 text-xs uppercase tracking-wider text-text-muted">{d.format}</span>
              </div>
              <p className="mt-2 flex-1 text-sm text-text-muted">{d.description}</p>
              <a
                href={d.file}
                download
                className="mt-4 inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-medium tracking-wide text-background transition hover:bg-gold-bright"
              >
                {w.downloadButton}
              </a>
            </div>
          </Card>
        ))}
      </div>

      <section className="mt-14 border-t border-border pt-10">
        <h2 className="font-heading text-xl text-text">{w.guestInfoHeading}</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-muted">{w.guestInfoBody}</p>
        <Link
          href="/fuer-gaeste"
          className="mt-6 inline-flex items-center justify-center rounded-full border border-gold px-5 py-2.5 text-sm font-medium tracking-wide text-gold transition hover:bg-gold/10"
        >
          {w.guestInfoButton}
        </Link>
      </section>

      <section className="mt-14 border-t border-border pt-10">
        <h2 className="font-heading text-xl text-text">{w.stickerHeading}</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-muted">{withBold(w.stickerBody1, "text-text")}</p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-muted">{w.stickerBody2}</p>
        <a
          href="mailto:mail@velvet-network.app?subject=Werbematerial%20f%C3%BCr%20unsere%20Location"
          className="mt-6 inline-flex items-center justify-center rounded-full border border-gold px-5 py-2.5 text-sm font-medium tracking-wide text-gold transition hover:bg-gold/10"
        >
          {w.contactButton}
        </a>
      </section>
    </div>
  );
}
