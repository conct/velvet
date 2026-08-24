"use client";

import { useState } from "react";
import type { AdminHiddenVenuesResult } from "@velvet/shared";
import { Button, Card, Heading } from "../../../../components/ui";
import { ApiError, apiFetch } from "../../../../lib/api";
import { useAuth } from "../../../../lib/auth-context";
import { useLocale } from "../../../../lib/locale-context";

export default function AdminHiddenVenuesPage() {
  const { t } = useLocale();
  const { token, staff } = useAuth();
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<AdminHiddenVenuesResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [unhidingVenueId, setUnhidingVenueId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    if (!token || !email.trim()) return;
    setSearching(true);
    setError(null);
    setResult(null);
    try {
      const data = await apiFetch<AdminHiddenVenuesResult>(
        `/admin/guests/hidden-venues?email=${encodeURIComponent(email.trim())}`,
        { token }
      );
      setResult(data);
    } catch (err) {
      // The server already returns a localized "no guest with this email"
      // message on 404, same as any other ApiError -- no separate status
      // check needed.
      setError(err instanceof ApiError ? err.message : t.pages.adminHiddenVenues.searchFailed);
    } finally {
      setSearching(false);
    }
  };

  const unhide = async (venueId: string) => {
    if (!token || !result) return;
    setUnhidingVenueId(venueId);
    setError(null);
    try {
      await apiFetch(`/admin/guests/${result.userId}/venues/${venueId}/unhide`, { method: "POST", token });
      setResult({ ...result, hiddenVenues: result.hiddenVenues.filter((v) => v.venueId !== venueId) });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.pages.adminHiddenVenues.unhideFailed);
    } finally {
      setUnhidingVenueId(null);
    }
  };

  if (staff && !staff.isPlatformAdmin) {
    return (
      <div>
        <Heading className="text-3xl">{t.pages.adminHiddenVenues.title}</Heading>
        <p className="mt-4 text-sm text-text-muted">{t.pages.adminHiddenVenues.adminOnly}</p>
      </div>
    );
  }

  return (
    <div>
      <Heading className="text-3xl">{t.pages.adminHiddenVenues.title}</Heading>
      <p className="mt-1 text-sm text-text-muted">{t.pages.adminHiddenVenues.subtitle}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder={t.pages.adminHiddenVenues.emailPlaceholder}
          className="min-w-[260px] flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-gold"
        />
        <Button disabled={searching || !email.trim()} onClick={search}>
          {searching ? t.pages.adminHiddenVenues.searching : t.pages.adminHiddenVenues.search}
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      {result && (
        <div className="mt-8">
          {result.hiddenVenues.length === 0 ? (
            <p className="text-sm text-text-muted">{t.pages.adminHiddenVenues.nothingHidden}</p>
          ) : (
            <Card className="p-0">
              <ul className="divide-y divide-border">
                {result.hiddenVenues.map((v) => (
                  <li key={v.venueId} className="flex items-center justify-between gap-3 px-6 py-4">
                    <div>
                      <div className="text-sm text-text">{v.venueName}</div>
                      <div className="text-xs text-text-muted">
                        {t.pages.adminHiddenVenues.hiddenSinceLabel}: {new Date(v.hiddenAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      disabled={unhidingVenueId === v.venueId}
                      onClick={() => unhide(v.venueId)}
                    >
                      {unhidingVenueId === v.venueId
                        ? t.pages.adminHiddenVenues.unhiding
                        : t.pages.adminHiddenVenues.unhide}
                    </Button>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
