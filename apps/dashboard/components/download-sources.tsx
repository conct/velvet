"use client";

import type { ReactNode } from "react";
import { availableDownloadSources, type DownloadSourceKey } from "../lib/app-downloads";
import { useLocale } from "../lib/locale-context";

// Neutral line icons rather than the official App Store / Google Play badges:
// both are trademarked artwork with their own placement and clear-space
// rules, and a plain gold-on-dark tile fits the rest of the page anyway.
function AppleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="6" y="2" width="12" height="20" rx="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="10.5" y1="18.5" x2="13.5" y2="18.5" strokeLinecap="round" />
    </svg>
  );
}

function AndroidIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 4.5 19.5 12 4 19.5Z" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="4" y1="4.5" x2="14" y2="14.5" strokeLinecap="round" />
      <line x1="4" y1="19.5" x2="14" y2="9.5" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" />
    </svg>
  );
}

const ICONS: Record<DownloadSourceKey, ReactNode> = {
  ios: <AppleIcon />,
  android: <AndroidIcon />,
  apk: <MailIcon />,
  web: <GlobeIcon />,
};

export function DownloadSources() {
  const { t } = useLocale();
  const sources = availableDownloadSources();
  const copy = t.landing.downloadSources;

  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {sources.map((source) => (
        <a
          key={source.key}
          href={source.href}
          {...(source.isFile ? { download: true } : {})}
          {...(source.isFile || source.isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
          className="flex items-center gap-4 rounded-2xl border border-border bg-surface px-5 py-4 text-left transition hover:border-gold/60 hover:bg-surface-raised"
        >
          <span className="text-gold">{ICONS[source.key]}</span>
          <span className="min-w-0">
            <span className="flex flex-wrap items-baseline gap-2">
              <span className="text-sm font-medium text-text">{copy[source.key].title}</span>
              {source.meta && <span className="text-xs text-gold-muted">{source.meta}</span>}
            </span>
            <span className="mt-0.5 block text-xs text-text-muted">{copy[source.key].body}</span>
          </span>
        </a>
      ))}
    </div>
  );
}
