import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailPageClient } from "../../components/verify-email-page-client";

export const metadata: Metadata = {
  title: "E-Mail bestätigen",
  robots: { index: false, follow: true },
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPageClient />
    </Suspense>
  );
}
