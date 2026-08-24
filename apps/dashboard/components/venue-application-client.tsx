"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { VENUE_TYPES, type VenueType } from "@velvet/shared";
import { Button, Heading, Input } from "./ui";
import { ApiError, apiUpload } from "../lib/api";
import { useLocale } from "../lib/locale-context";

const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;

export function VenueApplicationClient() {
  const { t } = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [venueName, setVenueName] = useState("");
  const [venueType, setVenueType] = useState<VenueType>("BAR");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [message, setMessage] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentFile) return;
    // Mirrors the server's own limit so an oversized file fails instantly
    // instead of after a full upload.
    if (documentFile.size > MAX_DOCUMENT_BYTES) {
      setError(t.pages.venueApplication.documentHint);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("venueName", venueName.trim());
      form.append("venueType", venueType);
      form.append("address", address.trim());
      form.append("website", website.trim());
      form.append("contactName", contactName.trim());
      form.append("contactEmail", contactEmail.trim());
      form.append("contactPhone", contactPhone.trim());
      form.append("message", message.trim());
      form.append("document", documentFile);

      await apiUpload("/venue-applications", form);
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.pages.venueApplication.submitFailed);
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center">
          <Heading className="text-xl">{t.pages.venueApplication.successTitle}</Heading>
          <p className="mt-3 text-sm text-text-muted">{t.pages.venueApplication.successBody}</p>
          <Link href="/" className="mt-6 inline-block text-sm text-gold hover:text-gold-bright">
            {t.pages.venueApplication.backHome}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl px-4 py-12 md:py-20">
      <div className="text-center">
        <Link href="/" className="font-heading text-3xl tracking-[0.3em] text-gold">
          VELVET
        </Link>
        <p className="mt-6 text-xs uppercase tracking-[0.18em] text-gold-muted">
          {t.pages.venueApplication.eyebrow}
        </p>
        <Heading className="mt-2 text-3xl">{t.pages.venueApplication.title}</Heading>
        <p className="mx-auto mt-3 max-w-lg text-sm text-text-muted">{t.pages.venueApplication.intro}</p>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-surface-raised p-5">
        <h2 className="font-heading text-sm text-gold">{t.pages.venueApplication.verifyTitle}</h2>
        <p className="mt-2 text-sm text-text-muted">{t.pages.venueApplication.verifyBody}</p>
      </div>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-8">
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 font-heading text-lg text-text">
            {t.pages.venueApplication.sectionVenue}
          </legend>
          <Input
            placeholder={t.pages.venueApplication.venueName}
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
            required
            maxLength={120}
          />
          <label className="sr-only" htmlFor="venueType">
            {t.pages.venueApplication.venueType}
          </label>
          <select
            id="venueType"
            value={venueType}
            onChange={(e) => setVenueType(e.target.value as VenueType)}
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text outline-none focus:border-gold"
          >
            {VENUE_TYPES.map((type) => (
              <option key={type} value={type}>
                {t.venueTypes[type]}
              </option>
            ))}
          </select>
          <Input
            placeholder={t.pages.venueApplication.address}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            maxLength={300}
          />
          <Input
            placeholder={t.pages.venueApplication.website}
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            maxLength={300}
          />
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 font-heading text-lg text-text">
            {t.pages.venueApplication.sectionContact}
          </legend>
          <Input
            placeholder={t.pages.venueApplication.contactName}
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
            maxLength={120}
          />
          <Input
            placeholder={t.pages.venueApplication.contactEmail}
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
          />
          <Input
            placeholder={t.pages.venueApplication.contactPhone}
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            maxLength={60}
          />
          <textarea
            placeholder={t.pages.venueApplication.message}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={2000}
            rows={4}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-gold"
          />
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 font-heading text-lg text-text">
            {t.pages.venueApplication.sectionDocument}
          </legend>
          <p className="text-sm text-text-muted">{t.pages.venueApplication.documentHint}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              {t.pages.venueApplication.documentChoose}
            </Button>
            <span className="text-sm text-text-muted">
              {documentFile ? documentFile.name : t.pages.venueApplication.documentNone}
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,image/jpeg,image/png"
            className="hidden"
            onChange={(e) => {
              setDocumentFile(e.target.files?.[0] ?? null);
              setError(null);
            }}
          />
        </fieldset>

        <div className="flex flex-col gap-3">
          <p className="text-xs text-text-muted">{t.pages.venueApplication.privacyHint}</p>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" disabled={submitting || !documentFile} className="self-start">
            {submitting ? t.pages.venueApplication.submitting : t.pages.venueApplication.submit}
          </Button>
        </div>
      </form>

      <div className="mt-10 flex justify-center gap-4 text-xs text-text-muted">
        <Link href="/impressum" className="hover:text-text">
          {t.landing.footerImpressum}
        </Link>
        <Link href="/datenschutz" className="hover:text-text">
          {t.landing.footerDatenschutz}
        </Link>
        <Link href="/location-bedingungen" className="hover:text-text">
          {t.landing.footerLocationTerms}
        </Link>
      </div>
    </div>
  );
}
