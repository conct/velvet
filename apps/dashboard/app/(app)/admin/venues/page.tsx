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
  const [busyId, setBusyId] = useState<string | null>(null);
  const [suspendingId, setSuspendingId] = useState<string | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
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

  const suspend = async (id: string) => {
    if (!token || !suspendReason.trim()) return;
    setBusyId(id);
    setError(null);
    try {
      await apiFetch(`/admin/venues/${id}/suspend`, { method: "POST", token, body: { reason: suspendReason.trim() } });
      setSuspendingId(null);
      setSuspendReason("");
      setReloadCount((n) => n + 1);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.pages.adminVenues.suspendFailed);
    } finally {
      setBusyId(null);
    }
  };

  const reactivate = async (id: string) => {
    if (!token) return;
    setBusyId(id);
    setError(null);
    try {
      await apiFetch(`/admin/venues/${id}/reactivate`, { method: "POST", token });
      setReloadCount((n) => n + 1);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.pages.adminVenues.reactivateFailed);
    } finally {
      setBusyId(null);
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
  const suspended = venues.filter((v) => v.status === "SUSPENDED");

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
                <li key={v.id} className="flex flex-col gap-3 px-6 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm text-text">{v.name}</div>
                      <div className="text-xs text-text-muted">{v.address}</div>
                    </div>
                    <button
                      onClick={() => {
                        setSuspendingId(suspendingId === v.id ? null : v.id);
                        setSuspendReason("");
                      }}
                      className="shrink-0 text-sm text-text-muted hover:text-danger"
                    >
                      {t.pages.adminVenues.suspend}
                    </button>
                  </div>
                  {suspendingId === v.id && (
                    <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
                      <textarea
                        placeholder={t.pages.adminVenues.suspendReasonPlaceholder}
                        value={suspendReason}
                        onChange={(e) => setSuspendReason(e.target.value)}
                        rows={2}
                        maxLength={500}
                        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-gold"
                      />
                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant="outline"
                          disabled={busyId === v.id || !suspendReason.trim()}
                          onClick={() => suspend(v.id)}
                        >
                          {busyId === v.id ? t.pages.adminVenues.suspending : t.pages.adminVenues.suspendConfirm}
                        </Button>
                        <button
                          onClick={() => setSuspendingId(null)}
                          className="text-sm text-text-muted hover:text-text"
                        >
                          {t.pages.adminVenues.cancel}
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {suspended.length > 0 && (
        <div className="mt-10">
          <h2 className="font-heading text-lg text-gold">{t.pages.adminVenues.suspendedHeading}</h2>
          <Card className="mt-4 p-0">
            <ul className="divide-y divide-border">
              {suspended.map((v) => (
                <li key={v.id} className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-sm text-text">{v.name}</div>
                    <div className="text-xs text-text-muted">{v.address}</div>
                    {v.suspendedAt && (
                      <div className="mt-1 text-xs text-text-muted">
                        {t.pages.adminVenues.suspendedSinceLabel}: {new Date(v.suspendedAt).toLocaleDateString()}
                      </div>
                    )}
                    {v.suspendedReason && (
                      <div className="text-xs text-text-muted">
                        {t.pages.adminVenues.suspendedReasonLabel}: {v.suspendedReason}
                      </div>
                    )}
                  </div>
                  <Button variant="outline" disabled={busyId === v.id} onClick={() => reactivate(v.id)}>
                    {busyId === v.id ? t.pages.adminVenues.reactivating : t.pages.adminVenues.reactivate}
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}
