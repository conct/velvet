import type { Metadata } from "next";
import { KontoLoeschenClient } from "../../components/konto-loeschen-client";

export const metadata: Metadata = {
  title: "Konto löschen",
  alternates: { canonical: "/konto-loeschen" },
};

export default function KontoLoeschenPage() {
  return <KontoLoeschenClient />;
}
