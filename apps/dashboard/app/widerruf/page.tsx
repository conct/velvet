import type { Metadata } from "next";
import { TERMS_DRAFT, TERMS_DRAFT_NOTICE, WIDERRUF_SECTIONS } from "@velvet/shared";
import { LegalPage } from "../../components/legal-page";

export const metadata: Metadata = {
  title: "Widerrufsbelehrung",
  alternates: { canonical: "/widerruf" },
};

export default function WiderrufPage() {
  return (
    <LegalPage
      title="Widerrufsbelehrung"
      sections={WIDERRUF_SECTIONS}
      notice={TERMS_DRAFT ? TERMS_DRAFT_NOTICE : undefined}
    />
  );
}
