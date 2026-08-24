import type { Metadata } from "next";
import { WerbematerialClient } from "../../components/werbematerial-client";

export const metadata: Metadata = {
  title: "Werbematerial",
  alternates: { canonical: "/werbematerial" },
};

export default function WerbematerialPage() {
  return <WerbematerialClient />;
}
