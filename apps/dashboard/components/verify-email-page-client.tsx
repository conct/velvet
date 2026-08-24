"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Heading } from "./ui";
import { ApiError, apiFetch } from "../lib/api";
import { useLocale } from "../lib/locale-context";

type Status = "verifying" | "done" | "error";

export function VerifyEmailPageClient() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<Status>(token ? "verifying" : "error");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        await apiFetch("/auth/verify-email", { method: "POST", body: { token } });
        setStatus("done");
      } catch (err) {
        setError(err instanceof ApiError ? err.message : t.common.genericError);
        setStatus("error");
      }
    })();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <Link href="/" className="font-heading text-4xl tracking-[0.3em] text-gold">
            VELVET
          </Link>
          <div className="mt-2 text-sm italic text-text-muted">{t.authFlow.verifyEmailSubtitle}</div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-8 text-center">
          {status === "verifying" && <p className="text-sm text-text-muted">{t.authFlow.verifying}</p>}
          {status === "done" && (
            <>
              <Heading className="mb-2 text-xl">{t.authFlow.emailVerifiedTitle}</Heading>
              <p className="text-sm text-text-muted">{t.authFlow.emailVerifiedBody}</p>
            </>
          )}
          {status === "error" && (
            <p className="text-sm text-danger">{error ?? t.authFlow.invalidVerifyLink}</p>
          )}
        </div>
      </div>
    </div>
  );
}
