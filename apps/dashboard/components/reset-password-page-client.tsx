"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button, Heading } from "./ui";
import { PasswordInput } from "./password-input";
import { ApiError, apiFetch } from "../lib/api";
import { useLocale } from "../lib/locale-context";

export function ResetPasswordPageClient() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const kind = searchParams.get("kind") === "user" ? "user" : "staff";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError(t.authFlow.passwordsDontMatch);
      return;
    }
    setLoading(true);
    try {
      await apiFetch("/auth/reset-password", { method: "POST", body: { token, kind, password } });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.common.genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <Link href="/" className="font-heading text-4xl tracking-[0.3em] text-gold">
            VELVET
          </Link>
          <div className="mt-2 text-sm italic text-text-muted">{t.authFlow.resetPasswordSubtitle}</div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-8">
          {!token ? (
            <p className="text-sm text-danger">{t.authFlow.invalidLink}</p>
          ) : done ? (
            <>
              <Heading className="mb-2 text-xl">{t.authFlow.passwordChangedTitle}</Heading>
              <p className="text-sm text-text-muted">{t.authFlow.passwordChangedBody}</p>
              <Button className="mt-3" onClick={() => router.push("/login")}>
                {t.authFlow.goToLogin}
              </Button>
            </>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3">
              <Heading className="mb-2 text-xl">{t.authFlow.setNewPasswordTitle}</Heading>
              <PasswordInput
                placeholder={t.authFlow.newPasswordPlaceholder}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordInput
                placeholder={t.authFlow.confirmPasswordPlaceholder}
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              {error && <p className="text-sm text-danger">{error}</p>}
              <Button type="submit" disabled={loading} className="mt-3">
                {loading ? t.authFlow.saving : t.authFlow.savePassword}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
