import type { Metadata } from "next";
import { DemoPageClient } from "../../components/demo-page-client";

export const metadata: Metadata = {
  title: "So funktioniert's",
  alternates: { canonical: "/demo" },
};

export default function DemoPage() {
  return <DemoPageClient />;
}
