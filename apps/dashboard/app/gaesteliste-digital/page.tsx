import type { Metadata } from "next";
import { TRANSLATIONS } from "@velvet/shared";
import { GaestelisteClient } from "../../components/gaesteliste-client";

export const metadata: Metadata = {
  title: "Digitale Gästeliste am Einlass",
  description:
    "Was das Türteam beim Scan sieht, was passiert wenn der Scan nicht klappt, welche Rollen es gibt und wie ein Abend festgehalten wird — für Clubbetreiber und Türteams.",
  alternates: { canonical: "/gaesteliste-digital" },
};

// Built from the German copy rather than a second hand-written list, so the
// structured data cannot drift away from what the page actually says.
const faq = TRANSLATIONS.de.pages.gaesteliste.faq;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a.join(" ") },
  })),
};

export default function GaestelistePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <GaestelisteClient />
    </>
  );
}
