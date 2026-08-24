import type { Metadata } from "next";
import { Suspense } from "react";
import { ForgotPasswordPageClient } from "../../components/forgot-password-page-client";

export const metadata: Metadata = {
  title: "Passwort vergessen",
  robots: { index: false, follow: true },
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordPageClient />
    </Suspense>
  );
}
