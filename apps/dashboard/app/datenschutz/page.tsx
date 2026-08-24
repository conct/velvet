import type { Metadata } from "next";
import { DATENSCHUTZ_SECTIONS } from "@velvet/shared";
import { LegalPage } from "../../components/legal-page";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  return <LegalPage title="Datenschutzerklärung" sections={DATENSCHUTZ_SECTIONS} />;
}
