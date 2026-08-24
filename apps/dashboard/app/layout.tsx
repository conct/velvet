import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/auth-context";
import { LocaleProvider } from "../lib/locale-context";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["400", "700"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://velvet-network.app"),
  title: {
    default: "VELVET — Geteiltes Vertrauensnetzwerk für den Türstand",
    template: "%s — VELVET",
  },
  description:
    "VELVET ist ein geteiltes Vertrauensnetzwerk für den Türstand: Gäste bauen sich eine Reputation auf, die über einen einzelnen Club hinausreicht. Türsteher sehen beim Scan sofort, wen sie vor sich haben. Betreiber schützen ihr Haus, ohne jeden Abend bei null anzufangen.",
  keywords: [
    "Türstand Software",
    "Gästeliste digital",
    "Einlasskontrolle Club",
    "Türsteher App",
    "Club Dashboard",
    "Gästebewertung Nachtleben",
    "VIP Gästeliste",
    "Hausverbot Netzwerk",
  ],
  applicationName: "VELVET",
  authors: [{ name: "Daniel von Lühmann" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "VELVET",
    title: "VELVET — Geteiltes Vertrauensnetzwerk für den Türstand",
    description:
      "Ein Profil, das mitwächst: Gäste bauen sich standortübergreifend eine Reputation auf, Türsteher sehen sie am Einlass sofort, Locations schützen sich gegenseitig.",
    url: "https://velvet-network.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "VELVET — Geteiltes Vertrauensnetzwerk für den Türstand",
    description: "Zugang, der sich verdient anfühlt.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${playfair.variable} ${inter.variable} h-full`}>
      <body className="min-h-full bg-background text-text antialiased">
        <LocaleProvider>
          <AuthProvider>{children}</AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
