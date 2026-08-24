import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/impressum", "/datenschutz"],
      disallow: [
        "/login",
        "/overview",
        "/guests",
        "/pending",
        "/settings",
        "/team",
        "/messages",
        "/admin/venues",
        "/admin/applications",
        "/venues/new",
        // Guest-facing explainer handed out via /werbematerial -- deliberately
        // unlisted so it does not compete with /datenschutz in search.
        "/fuer-gaeste",
      ],
    },
    sitemap: "https://velvet-network.app/sitemap.xml",
  };
}
