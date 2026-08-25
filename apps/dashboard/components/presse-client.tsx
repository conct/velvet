"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LEGAL_OPERATOR } from "@velvet/shared";
import { Card } from "./ui";
import { useLocale } from "../lib/locale-context";

/**
 * Copies to the clipboard and flips its own label for a moment. Journalists
 * take the boilerplate away with them, so the copy has to be one click --
 * selecting a paragraph by hand is where wording gets truncated.
 */
function CopyBlock({
  label,
  text,
  copyLabel,
  copiedLabel,
}: {
  label: string;
  text: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused (insecure context, permission denied).
      // The text is on the page either way, so a failed copy is not worth an
      // error message -- the button simply does not confirm.
    }
  };

  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs uppercase tracking-[0.14em] text-gold-muted">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-full border border-gold-muted px-3 py-1 text-xs text-gold transition hover:border-gold hover:text-gold-bright"
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <p className="text-sm leading-relaxed text-text-muted">{text}</p>
    </Card>
  );
}

export function PresseClient() {
  const { t } = useLocale();
  const p = t.pages.presse;

  // The transparent logo is shown on a light panel on purpose: side by side on
  // the same dark ground the two files look identical, which is exactly the
  // difference someone visiting a press kit is trying to see.
  const logos = [
    { title: p.logoOnDark, file: "/material/velvet-logo.png", onLight: false },
    { title: p.logoTransparent, file: "/material/velvet-logo-transparent.png", onLight: true },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-10">
      <Link href="/" className="text-sm text-gold hover:text-gold-bright">
        ← {t.legal.back}
      </Link>

      <p className="mt-6 text-xs uppercase tracking-[0.18em] text-gold-muted">{p.eyebrow}</p>
      <h1 className="mt-3 font-heading text-3xl text-text">{p.title}</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-muted">{p.intro}</p>

      <section className="mt-12">
        <h2 className="font-heading text-lg text-gold">{p.factsHeading}</h2>
        <dl className="mt-4 grid gap-px overflow-hidden rounded border border-border bg-border sm:grid-cols-2">
          {p.facts.map((f) => (
            <div key={f.label} className="flex flex-col gap-1 bg-background px-4 py-3">
              <dt className="text-xs uppercase tracking-[0.12em] text-text-muted">{f.label}</dt>
              <dd className="text-sm text-text">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-lg text-gold">{p.boilerplateHeading}</h2>
        <p className="mt-2 text-sm text-text-muted">{p.boilerplateIntro}</p>
        <div className="mt-4 flex flex-col gap-4">
          <CopyBlock
            label={p.shortLabel}
            text={p.shortText}
            copyLabel={p.copyButton}
            copiedLabel={p.copiedButton}
          />
          <CopyBlock
            label={p.longLabel}
            text={p.longText}
            copyLabel={p.copyButton}
            copiedLabel={p.copiedButton}
          />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-lg text-gold">{p.logosHeading}</h2>
        <p className="mt-2 text-sm text-text-muted">{p.logosIntro}</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          {logos.map((logo) => (
            <Card key={logo.file} className="flex flex-col overflow-hidden p-0">
              <div className={`border-b border-border p-6 ${logo.onLight ? "bg-text" : "bg-background"}`}>
                <Image
                  src={logo.file}
                  alt={logo.title}
                  width={400}
                  height={200}
                  className="mx-auto h-auto w-full max-w-[220px]"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-heading text-base text-text">{logo.title}</h3>
                <a
                  href={logo.file}
                  download
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-medium tracking-wide text-background transition hover:bg-gold-bright"
                >
                  {p.downloadButton}
                </a>
              </div>
            </Card>
          ))}
        </div>
        <p className="mt-4 text-sm text-text-muted">
          {p.printBody}{" "}
          <Link href="/werbematerial" className="text-gold hover:text-gold-bright">
            {p.printLinkLabel}
          </Link>
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-lg text-gold">{p.contactHeading}</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-muted">{p.contactBody}</p>
        <a
          href={`mailto:${LEGAL_OPERATOR.email}`}
          className="mt-4 inline-flex items-center justify-center rounded-full border border-gold px-5 py-2.5 text-sm font-medium tracking-wide text-gold transition hover:bg-gold hover:text-background"
        >
          {p.contactButton}
        </a>
      </section>
    </div>
  );
}
