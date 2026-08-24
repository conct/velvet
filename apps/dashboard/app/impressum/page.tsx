import type { Metadata } from "next";
import { IMPRESSUM_SECTIONS } from "@velvet/shared";
import { LegalPage } from "../../components/legal-page";

export const metadata: Metadata = {
  title: "Impressum",
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  return <LegalPage title="Impressum" sections={IMPRESSUM_SECTIONS} />;
}
