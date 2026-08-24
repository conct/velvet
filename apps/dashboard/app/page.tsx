import type { Metadata } from "next";
import { LEGAL_OPERATOR } from "@velvet/shared";
import { LandingPageClient } from "../components/landing-page-client";

export const metadata: Metadata = {
  title: "Geteiltes Vertrauensnetzwerk für den Türstand",
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "VELVET",
  url: "https://velvet-network.app",
  description:
    "VELVET ist ein geteiltes Vertrauensnetzwerk für den Türstand: Gäste bauen sich eine Reputation auf, die über einen einzelnen Club hinausreicht. Türsteher sehen beim Scan sofort, wen sie vor sich haben. Betreiber schützen ihr Haus, ohne jeden Abend bei null anzufangen.",
  slogan: "Zugang, der sich verdient anfühlt.",
  founder: { "@type": "Person", name: LEGAL_OPERATOR.name },
  email: LEGAL_OPERATOR.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: LEGAL_OPERATOR.street,
    postalCode: LEGAL_OPERATOR.postalCode,
    addressLocality: LEGAL_OPERATOR.city,
    addressCountry: "DE",
  },
  areaServed: "DE",
  audience: [
    { "@type": "Audience", audienceType: "Gäste von Clubs und Locations" },
    { "@type": "Audience", audienceType: "Türsteher und Sicherheitsdienste" },
    { "@type": "Audience", audienceType: "Clubbetreiber und Management" },
  ],
};

export default function LandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandingPageClient />
    </>
  );
}
