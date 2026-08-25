import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://velvet-network.app";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/demo`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/location-anmelden`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/werbematerial`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/presse`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/impressum`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/datenschutz`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/agb`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/widerruf`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/location-bedingungen`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/konto-loeschen`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
