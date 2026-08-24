"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { VenueSummary } from "@velvet/shared";
import { Button, Heading, Input } from "./ui";
import { PasswordInput } from "./password-input";
import { ApiError } from "../lib/api";
import { NeedsVenueSelectionError, useAuth } from "../lib/auth-context";
import { useLocale } from "../lib/locale-context";
import { LanguageSwitcher } from "./language-switcher";

export function LoginPageClient() {
  const router = useRouter();
  const { ready, token, login, selectVenue } = useAuth();
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [venuePicker, setVenuePicker] = useState<{ venues: VenueSummary[]; preAuthToken: string } | null>(null);

  useEffect(() => {
    if (ready && token) router.replace("/overview");
  }, [ready, token, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace("/overview");
    } catch (err) {
      if (err instanceof NeedsVenueSelectionError) {
        setVenuePicker({ venues: err.venues, preAuthToken: err.preAuthToken });
      } else {
        setError(err instanceof ApiError ? err.message : t.common.genericError);
      }
    } finally {
      setLoading(false);
    }
  };

  const pickVenue = async (venueId: string) => {
    if (!venuePicker) return;
    setError(null);
    setLoading(true);
    try {
      await selectVenue(venuePicker.preAuthToken, venueId);
      router.replace("/overview");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.common.genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Link
        href="/"
        className="fixed left-4 top-4 flex items-center gap-1.5 text-sm text-text-muted hover:text-text md:left-8 md:top-8"
      >
        <span aria-hidden>←</span> Startseite
      </Link>

      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <Link href="/" className="font-heading text-4xl tracking-[0.3em] text-gold">
            VELVET
          </Link>
          <div className="mt-2 text-sm italic text-text-muted">{t.login.subtitle}</div>
        </div>

        {venuePicker ? (
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-8">
            <Heading className="mb-2 text-xl">{t.login.chooseVenue}</Heading>
            <p className="-mt-1 mb-1 text-sm text-text-muted">{t.login.chooseVenueSubtitle}</p>
            {venuePicker.venues.map((venue) => (
              <button
                key={venue.id}
                type="button"
                disabled={loading}
                onClick={() => pickVenue(venue.id)}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-left text-sm text-text transition hover:border-gold hover:text-gold disabled:opacity-50"
              >
                <span>{venue.name}</span>
                {venue.status !== "VERIFIED" && (
                  <span className="text-xs text-text-muted">{t.login.notVerified}</span>
                )}
              </button>
            ))}
            {error && <p className="text-sm text-danger">{error}</p>}
            <button
              type="button"
              onClick={() => setVenuePicker(null)}
              className="mt-1 text-xs text-text-muted hover:text-text"
            >
              {t.login.back}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-8">
            <Heading className="mb-2 text-xl">{t.login.heading}</Heading>
            <Input
              placeholder={t.login.email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              placeholder={t.login.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" disabled={loading} className="mt-3">
              {loading ? t.login.submitting : t.login.submit}
            </Button>
            <Link href="/forgot-password" className="text-center text-xs text-text-muted hover:text-text">
              {t.login.forgotPassword}
            </Link>
          </form>
        )}

        <div className="mt-6 flex justify-center gap-4 text-xs text-text-muted">
          <Link href="/impressum" className="hover:text-text">
            Impressum
          </Link>
          <Link href="/datenschutz" className="hover:text-text">
            Datenschutz
          </Link>
        </div>
        <div className="mt-4 flex justify-center">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
