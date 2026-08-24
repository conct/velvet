"use client";

import { useEffect, useState } from "react";
import type { AdminVenue } from "@velvet/shared";
import { Button, Card, Heading } from "../../../../components/ui";
import { ApiError, apiFetch } from "../../../../lib/api";
import { useAuth } from "../../../../lib/auth-context";
import { useLocale } from "../../../../lib/locale-context";

export default function AdminVenuesPage() {
  const { t } = useLocale();
  const { token, staff } = useAuth();
  const [venues, setVenues] = useState<AdminVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Bumped after a verify to re-run the fetch below. A shared load() called
  // from both the effect and the handlers would have to set state
  // synchronously inside the effect, which cascades an extra render on every
  // mount; from an event handler the same setState is fine.
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    apiFetch<AdminVenue[]>("/admin/venues", { token })
      .then((data) => {
        if (!cancelled) setVenues(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : t.pages.adminVenues.loadFailed);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    // Guards against an earlier, slower response landing after a newer one
    // when the venue (and with it the token) is switched mid-request.
    return () => {
      cancelled = true;
    };
  }, [token, reloadCount, t]);

  const verify = async (id: string) => {
    if (!token) return;
    setVerifyingId(id);
    setError(null);
    try {
      await apiFetch(`/admin/venues/${id}/verify`, { method: "POST", token });
      setReloadCount((n) => n + 1);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.pages.adminVenues.verifyFailed);
    } finally {
      setVerifyingId(null);
    }
  };

  if (staff && !staff.isPlatformAdmin) {
    return (
      <div>
        <Heading className="text-3xl">{t.pages.adminVenues.title}</Heading>
        <p className="mt-4 text-sm text-text-muted">{t.pages.adminVenues.adminOnly}</p>
      </div>
    );
  }

  const pending = venues.filter((v) => v.status === "PENDING");
  const verified = venues.filter((v) => v.status === "VERIFIED");

  return (
    <div>
      <Heading className="text-3xl">{t.pages.adminVenues.title}</Heading>
      <p className="mt-1 text-sm text-text-muted">{t.pages.adminVenues.subtitle}</p>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      <div className="mt-8">
        <h2 className="font-heading text-lg text-gold">{t.pages.adminVenues.pendingHeading}</h2>
        {loading ? (
          <p className="mt-3 text-sm text-text-muted">{t.common.loading}</p>
        ) : pending.length === 0 ? (
          <p className="mt-3 text-sm text-text-muted">{t.pages.pending.nothingPending}</p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-2xl border border-border">
            {pending.map((v, i) => (
              <div
                key={v.id}
                className={`flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <div>
                  <div className="text-sm text-text">{v.name}</div>
                  <div className="text-xs text-text-muted">{v.address}</div>
                </div>
                <Button
                  variant="outline"
                  disabled={verifyingId === v.id}
                  onClick={() => verify(v.id)}
                  className="self-start sm:self-auto"
                >
                  {verifyingId === v.id ? t.pages.adminVenues.verifying : t.pages.adminVenues.verify}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {verified.length > 0 && (
        <div className="mt-10">
          <h2 className="font-heading text-lg text-gold">{t.pages.adminVenues.verifiedHeading}</h2>
          <Card className="mt-4 p-0">
            <ul className="divide-y divide-border">
              {verified.map((v) => (
                <li key={v.id} className="flex items-center justify-between px-6 py-3 text-sm">
                  <span className="text-text">{v.name}</span>
                  <span className="text-xs text-text-muted">{v.address}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}
