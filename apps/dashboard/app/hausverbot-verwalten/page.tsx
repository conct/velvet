import type { Metadata } from "next";
import { TRANSLATIONS } from "@velvet/shared";
import { HausverbotClient } from "../../components/hausverbot-client";

export const metadata: Metadata = {
  title: "Hausverbot digital verwalten",
  description:
    "Warum die Liste an der Tür nicht trägt, woran ein Hausverbot in VELVET hängt und ab wann es netzwerkweit wirkt — für Clubbetreiber und Türteams.",
  alternates: { canonical: "/hausverbot-verwalten" },
};

// Built from the German copy rather than a second hand-written list, so the
// structured data cannot drift away from what the page actually says.
const faq = TRANSLATIONS.de.pages.hausverbot.faq;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a.join(" ") },
  })),
};

export default function HausverbotPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <HausverbotClient />
    </>
  );
}
