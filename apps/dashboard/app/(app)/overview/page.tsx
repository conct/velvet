"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, Card, Heading, TierBadge } from "../../../components/ui";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import { useLocale } from "../../../lib/locale-context";

interface Guest {
  userId: string;
  firstName: string;
  lastName: string;
  globalTier: string;
}

interface PendingEntry {
  entryLogId: string;
  displayName: string;
  photoUrl: string | null;
  scannedAt: string;
}

const TIER_ORDER = ["VIP", "TRUSTED", "STANDARD", "WATCH", "BANNED"];

export default function OverviewPage() {
  const { token, staff } = useAuth();
  const { t, locale } = useLocale();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [pending, setPending] = useState<PendingEntry[]>([]);

  useEffect(() => {
    if (!token) return;
    apiFetch<Guest[]>("/venues/me/guests", { token }).then(setGuests).catch(() => {});
    apiFetch<PendingEntry[]>("/ratings/pending", { token }).then(setPending).catch(() => {});
  }, [token]);

  const distribution = TIER_ORDER.map((tier) => ({
    tier,
    count: guests.filter((g) => g.globalTier === tier).length,
  }));

  return (
    <div>
      <div className="mb-1 text-sm text-text-muted">{t.pages.overview.welcomeBack}</div>
      <Heading className="text-3xl">{staff?.venue.name}</Heading>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        {distribution.map((d) => (
          <Card key={d.tier} className="text-center">
            <div className="mb-2">
              <TierBadge tier={d.tier} size="sm" />
            </div>
            <div className="font-heading text-3xl text-text">{d.count}</div>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <Heading as="h2" className="text-xl">{t.pages.overview.recentCheckins}</Heading>
          <Link href="/pending" className="text-sm text-gold hover:text-gold-bright">
            {t.pages.overview.rateAll}
          </Link>
        </div>
        <Card className="p-0">
          {pending.length === 0 ? (
            <div className="p-6 text-sm text-text-muted">{t.pages.overview.nothingPending}</div>
          ) : (
            <ul className="divide-y divide-border">
              {pending.slice(0, 6).map((entry) => (
                <li key={entry.entryLogId} className="flex items-center justify-between px-6 py-4">
                  <span className="flex items-center gap-3">
                    <Avatar uri={entry.photoUrl} name={entry.displayName} size={32} />
                    <span className="text-sm text-text">{entry.displayName}</span>
                  </span>
                  <span className="text-xs text-text-muted">
                    {new Date(entry.scannedAt).toLocaleTimeString(locale === "de" ? "de-DE" : "en-US")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
