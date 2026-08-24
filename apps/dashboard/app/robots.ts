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
        "/venues/new",
      ],
    },
    sitemap: "https://velvet-network.app/sitemap.xml",
  };
}
