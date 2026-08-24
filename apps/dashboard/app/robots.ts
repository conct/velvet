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
        "/admin/hidden-venues",
        "/venues/new",
        // Guest-facing explainer handed out via /werbematerial -- deliberately
        // unlisted so it does not compete with /datenschutz in search.
        "/fuer-gaeste",
        // Internal write-up, not part of the product. Kept out of the
        // sitemap as well, and the page itself sends noindex -- robots.txt
        // alone only stops the crawl, not an index entry built from links.
        "/making-of",
      ],
    },
    sitemap: "https://velvet-network.app/sitemap.xml",
  };
}
