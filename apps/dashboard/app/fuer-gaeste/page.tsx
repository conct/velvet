import type { Metadata } from "next";
import { GuestInfoClient } from "../../components/guest-info-client";

export const metadata: Metadata = {
  title: "Was VELVET über dich weiß",
  // Deliberately kept out of search results: this is material a venue hands to
  // its guests (linked from /werbematerial), not a page that should compete
  // with the actual Datenschutzerklärung for the same queries. Also absent
  // from sitemap.ts and disallowed in robots.ts.
  robots: { index: false, follow: false },
};

export default function GuestInfoPage() {
  return <GuestInfoClient />;
}
