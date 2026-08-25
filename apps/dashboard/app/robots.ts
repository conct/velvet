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
        // /fuer-gaeste is NOT listed here for the same reason /making-of is
        // not: it carries a noindex tag, and a Disallow would stop the crawler
        // from ever fetching the page that states it -- leaving it indexable
        // from any inbound link, which is the outcome the tag exists to
        // prevent.
      ],
    },
    sitemap: "https://velvet-network.app/sitemap.xml",
  };
}
