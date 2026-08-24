import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/impressum", "/datenschutz"],
      // /making-of is deliberately NOT listed here. It carries a noindex tag
      // instead, and a crawler has to fetch the page to see that tag -- a
      // Disallow entry would hide the very instruction that keeps it out of
      // the index, leaving it indexable from any link pointing at it.
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
      ],
    },
    sitemap: "https://velvet-network.app/sitemap.xml",
  };
}
