import type { Metadata } from "next";
import { LEGAL_OPERATOR } from "@velvet/shared";
import { PresseClient } from "../../components/presse-client";

export const metadata: Metadata = {
  title: "Pressebereich",
  description:
    "Pressematerial zu VELVET: freigegebene Beschreibungstexte in zwei Längen, Logos zum Herunterladen, Eckdaten und Kontakt für Redaktionen.",
  alternates: { canonical: "/presse" },
};

// A press kit is the one page journalists look for by name, so it carries its
// own contact point rather than pointing at the imprint.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "VELVET — Pressebereich",
  url: "https://velvet-network.app/presse",
  description:
    "Pressematerial zu VELVET: freigegebene Beschreibungstexte, Logos und Eckdaten für die Berichterstattung.",
  about: {
    "@type": "Organization",
    name: "VELVET",
    url: "https://velvet-network.app",
    email: LEGAL_OPERATOR.email,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "press",
      email: LEGAL_OPERATOR.email,
      availableLanguage: ["de", "en"],
    },
  },
};

export default function PressePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PresseClient />
    </>
  );
}
