"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button, Heading, Input } from "./ui";
import { apiFetch } from "../lib/api";
import { useLocale } from "../lib/locale-context";

export function ForgotPasswordPageClient() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const kind = searchParams.get("kind") === "user" ? "user" : "staff";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch("/auth/forgot-password", { method: "POST", body: { email: email.trim(), kind } });
    } catch {
      // Deliberately ignored — the endpoint always responds the same way either way.
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Link
        href="/login"
        className="fixed left-4 top-4 flex items-center gap-1.5 text-sm text-text-muted hover:text-text md:left-8 md:top-8"
      >
        <span aria-hidden>←</span> {t.authFlow.backToLogin}
      </Link>

      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <Link href="/" className="font-heading text-4xl tracking-[0.3em] text-gold">
            VELVET
          </Link>
          <div className="mt-2 text-sm italic text-text-muted">{t.authFlow.forgotPasswordSubtitle}</div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-8">
          {sent ? (
            <>
              <Heading className="mb-2 text-xl">{t.authFlow.emailSentTitle}</Heading>
              <p className="text-sm text-text-muted">{t.authFlow.emailSentBody}</p>
            </>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3">
              <Heading className="mb-2 text-xl">{t.authFlow.forgotPasswordTitle}</Heading>
              <p className="-mt-1 mb-1 text-sm text-text-muted">{t.authFlow.forgotPasswordBody}</p>
              <Input
                placeholder={t.login.email}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" disabled={loading} className="mt-3">
                {loading ? t.authFlow.sending : t.authFlow.sendLink}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
