import type { Metadata } from "next";
import { MakingOfClient } from "../../components/making-of-client";

export const metadata: Metadata = {
  title: "Making Of",
  alternates: { canonical: "/making-of" },
};

export default function MakingOfPage() {
  return <MakingOfClient />;
}
