import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordPageClient } from "../../components/reset-password-page-client";

export const metadata: Metadata = {
  title: "Passwort zurücksetzen",
  robots: { index: false, follow: true },
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPageClient />
    </Suspense>
  );
}
