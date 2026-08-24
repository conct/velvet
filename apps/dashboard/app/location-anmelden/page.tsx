import type { Metadata } from "next";
import { VenueApplicationClient } from "../../components/venue-application-client";

export const metadata: Metadata = {
  title: "Location anmelden",
  description:
    "Club, Bar oder Kneipe bei VELVET anmelden — Angaben und Gewerbeanmeldung einreichen, wir prüfen und schalten frei.",
};

export default function VenueApplicationPage() {
  return <VenueApplicationClient />;
}
