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

  const load = () => {
    if (!token) return;
    setLoading(true);
    apiFetch<AdminVenue[]>("/admin/venues", { token })
      .then(setVenues)
      .catch((err) => setError(err instanceof ApiError ? err.message : t.pages.adminVenues.loadFailed))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const verify = async (id: string) => {
    if (!token) return;
    setVerifyingId(id);
    setError(null);
    try {
      await apiFetch(`/admin/venues/${id}/verify`, { method: "POST", token });
      load();
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
