"use client";

import { useEffect, useState } from "react";
import { Avatar, Card, Heading, Input, TierBadge } from "../../../components/ui";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import { useLocale } from "../../../lib/locale-context";

interface Guest {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string | null;
  visits: number;
  lastVisitAt: string | null;
  localFlag: "NONE" | "VIP" | "BANNED";
  privateNote: string | null;
  globalTier: string;
  globalScore: number;
}

export default function GuestsPage() {
  const { token } = useAuth();
  const { t, locale } = useLocale();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [query, setQuery] = useState("");
  const FLAG_LABEL: Record<string, string> = { VIP: t.pages.guests.flagVip, BANNED: t.pages.guests.flagBanned, NONE: "" };

  useEffect(() => {
    if (!token) return;
    const handle = setTimeout(() => {
      apiFetch<Guest[]>(`/venues/me/guests?q=${encodeURIComponent(query)}`, { token }).then(setGuests).catch(() => {});
    }, 200);
    return () => clearTimeout(handle);
  }, [token, query]);

  return (
    <div>
      <Heading className="text-3xl">{t.pages.guests.title}</Heading>
      <p className="mt-1 text-sm text-text-muted">{t.pages.guests.subtitle}</p>

      <div className="mt-6 max-w-sm">
        <Input placeholder={t.pages.guests.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <Card className="mt-6 overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-text-muted">
              <th className="px-6 py-4 font-medium">{t.pages.guests.colGuest}</th>
              <th className="px-6 py-4 font-medium">{t.pages.guests.colGlobalStatus}</th>
              <th className="px-6 py-4 font-medium">{t.pages.guests.colVisits}</th>
              <th className="px-6 py-4 font-medium">{t.pages.guests.colHere}</th>
              <th className="px-6 py-4 font-medium">{t.pages.guests.colLastVisit}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {guests.map((g) => (
              <tr key={g.userId}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar uri={g.photoUrl} name={g.firstName} size={36} />
                    <div>
                      <div className="text-text">
                        {g.firstName} {g.lastName}
                      </div>
                      <div className="text-xs text-text-muted">{g.email}</div>
                      {g.privateNote && <div className="mt-1 text-xs italic text-text-muted">„{g.privateNote}“</div>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <TierBadge tier={g.globalTier} size="sm" />
                  <div className="mt-1 text-xs text-text-muted">{g.globalScore.toFixed(2)} / 5.0</div>
                </td>
                <td className="px-6 py-4 text-text">{g.visits}</td>
                <td className="px-6 py-4 text-gold">{FLAG_LABEL[g.localFlag]}</td>
                <td className="px-6 py-4 text-text-muted">
                  {g.lastVisitAt ? new Date(g.lastVisitAt).toLocaleDateString(locale === "de" ? "de-DE" : "en-US") : "—"}
                </td>
              </tr>
            ))}
            {guests.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-text-muted">
                  {t.pages.guests.noneFound}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
