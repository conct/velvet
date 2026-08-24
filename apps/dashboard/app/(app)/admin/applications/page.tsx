"use client";

import { useEffect, useState } from "react";
import type { AdminVenueApplication } from "@velvet/shared";
import { Button, Card, Heading } from "../../../../components/ui";
import { ApiError, apiFetch, fetchProtectedFileUrl } from "../../../../lib/api";
import { useAuth } from "../../../../lib/auth-context";
import { useLocale } from "../../../../lib/locale-context";

export default function AdminApplicationsPage() {
  const { t } = useLocale();
  const { token, staff } = useAuth();
  const [applications, setApplications] = useState<AdminVenueApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);
  // Which application currently has its rejection form expanded, plus the
  // reason typed into it -- rejecting always mails the applicant, so it never
  // happens on a single unexplained click.
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    if (!token) return;
    setLoading(true);
    apiFetch<AdminVenueApplication[]>("/admin/venue-applications", { token })
      .then(setApplications)
      .catch((err) => setError(err instanceof ApiError ? err.message : t.pages.adminApplications.loadFailed))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const openDocument = async (id: string) => {
    if (!token) return;
    setOpeningId(id);
    setError(null);
    try {
      const url = await fetchProtectedFileUrl(`/admin/venue-applications/${id}/document`, token);
      window.open(url, "_blank", "noopener");
      // The tab keeps its own reference to the blob until it is closed, so the
      // object URL can be released here rather than leaking for the session.
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.pages.adminApplications.openFailed);
    } finally {
      setOpeningId(null);
    }
  };

  const approve = async (id: string) => {
    if (!token) return;
    setBusyId(id);
    setError(null);
    try {
      await apiFetch(`/admin/venue-applications/${id}/approve`, { method: "POST", token, body: {} });
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.pages.adminApplications.approveFailed);
    } finally {
      setBusyId(null);
    }
  };

  const reject = async (id: string) => {
    if (!token || !rejectReason.trim()) return;
    setBusyId(id);
    setError(null);
    try {
      await apiFetch(`/admin/venue-applications/${id}/reject`, {
        method: "POST",
        token,
        body: { reason: rejectReason.trim() },
      });
      setRejectingId(null);
      setRejectReason("");
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.pages.adminApplications.rejectFailed);
    } finally {
      setBusyId(null);
    }
  };

  if (staff && !staff.isPlatformAdmin) {
    return (
      <div>
        <Heading className="text-3xl">{t.pages.adminApplications.title}</Heading>
        <p className="mt-4 text-sm text-text-muted">{t.pages.adminApplications.adminOnly}</p>
      </div>
    );
  }

  const pending = applications.filter((a) => a.status === "PENDING");
  const decided = applications.filter((a) => a.status !== "PENDING");

  return (
    <div>
      <Heading className="text-3xl">{t.pages.adminApplications.title}</Heading>
      <p className="mt-1 text-sm text-text-muted">{t.pages.adminApplications.subtitle}</p>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      <div className="mt-8">
        <h2 className="font-heading text-lg text-gold">{t.pages.adminApplications.pendingHeading}</h2>
        {loading ? (
          <p className="mt-3 text-sm text-text-muted">{t.common.loading}</p>
        ) : pending.length === 0 ? (
          <p className="mt-3 text-sm text-text-muted">{t.pages.adminApplications.nothingPending}</p>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {pending.map((a) => (
              <Card key={a.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <Heading as="h3" className="text-lg">
                    {a.venueName}
                  </Heading>
                  <span className="text-xs uppercase tracking-wider text-gold-muted">
                    {t.venueTypes[a.venueType]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-text-muted">{a.address}</p>

                <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
                  <dt className="text-text-muted">{t.pages.adminApplications.contactLabel}</dt>
                  <dd className="text-text">
                    {a.contactName} · {a.contactEmail}
                    {a.contactPhone ? ` · ${a.contactPhone}` : ""}
                  </dd>
                  {a.website && (
                    <>
                      <dt className="text-text-muted">{t.pages.adminApplications.websiteLabel}</dt>
                      <dd className="break-all text-text">{a.website}</dd>
                    </>
                  )}
                  {a.message && (
                    <>
                      <dt className="text-text-muted">{t.pages.adminApplications.messageLabel}</dt>
                      <dd className="whitespace-pre-line text-text">{a.message}</dd>
                    </>
                  )}
                  <dt className="text-text-muted">{t.pages.adminApplications.documentLabel}</dt>
                  <dd className="break-all text-text">{a.documentName}</dd>
                </dl>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Button variant="outline" disabled={openingId === a.id} onClick={() => openDocument(a.id)}>
                    {openingId === a.id
                      ? t.pages.adminApplications.opening
                      : t.pages.adminApplications.openDocument}
                  </Button>
                  <Button disabled={busyId === a.id} onClick={() => approve(a.id)}>
                    {busyId === a.id && rejectingId !== a.id
                      ? t.pages.adminApplications.approving
                      : t.pages.adminApplications.approve}
                  </Button>
                  <button
                    onClick={() => {
                      setRejectingId(rejectingId === a.id ? null : a.id);
                      setRejectReason("");
                    }}
                    className="text-sm text-text-muted hover:text-danger"
                  >
                    {t.pages.adminApplications.reject}
                  </button>
                </div>
                <p className="mt-2 text-xs text-text-muted">{t.pages.adminApplications.approveHint}</p>

                {rejectingId === a.id && (
                  <div className="mt-4 flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
                    <textarea
                      placeholder={t.pages.adminApplications.rejectReason}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      rows={3}
                      maxLength={2000}
                      className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-gold"
                    />
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        disabled={busyId === a.id || !rejectReason.trim()}
                        onClick={() => reject(a.id)}
                      >
                        {busyId === a.id
                          ? t.pages.adminApplications.rejecting
                          : t.pages.adminApplications.rejectConfirm}
                      </Button>
                      <button
                        onClick={() => setRejectingId(null)}
                        className="text-sm text-text-muted hover:text-text"
                      >
                        {t.pages.adminApplications.cancel}
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {decided.length > 0 && (
        <div className="mt-10">
          <h2 className="font-heading text-lg text-gold">{t.pages.adminApplications.decidedHeading}</h2>
          <Card className="mt-4 p-0">
            <ul className="divide-y divide-border">
              {decided.map((a) => (
                <li key={a.id} className="px-6 py-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-text">{a.venueName}</span>
                    <span className={a.status === "APPROVED" ? "text-xs text-gold" : "text-xs text-text-muted"}>
                      {a.status === "APPROVED"
                        ? t.pages.adminApplications.statusApproved
                        : t.pages.adminApplications.statusRejected}
                    </span>
                  </div>
                  {a.reviewNote && (
                    <p className="mt-1 text-xs text-text-muted">
                      {t.pages.adminApplications.reviewNoteLabel}: {a.reviewNote}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}
