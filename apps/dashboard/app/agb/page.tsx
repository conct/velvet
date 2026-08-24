import type { Metadata } from "next";
import { GUEST_TERMS_SECTIONS, TERMS_DRAFT, TERMS_DRAFT_NOTICE } from "@velvet/shared";
import { LegalPage } from "../../components/legal-page";

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen",
  alternates: { canonical: "/agb" },
};

export default function AgbPage() {
  return (
    <LegalPage
      title="Allgemeine Geschäftsbedingungen"
      sections={GUEST_TERMS_SECTIONS}
      notice={TERMS_DRAFT ? TERMS_DRAFT_NOTICE : undefined}
    />
  );
}
