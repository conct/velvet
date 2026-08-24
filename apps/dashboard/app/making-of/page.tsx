import type { Metadata } from "next";
import { MakingOfClient } from "../../components/making-of-client";

export const metadata: Metadata = {
  title: "Making Of",
  alternates: { canonical: "/making-of" },
  // Reachable by anyone with the link, but deliberately not in search: the
  // page is an internal write-up, not part of what VELVET offers.
  robots: { index: false, follow: false },
};

export default function MakingOfPage() {
  return <MakingOfClient />;
}
