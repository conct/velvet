import type { Metadata } from "next";
import {
  JOINT_CONTROLLER_SECTIONS,
  LOCATION_TERMS_SECTIONS,
  TERMS_DRAFT,
  TERMS_DRAFT_NOTICE,
} from "@velvet/shared";
import { LegalPage } from "../../components/legal-page";

export const metadata: Metadata = {
  title: "Nutzungsbedingungen für Locations",
  alternates: { canonical: "/location-bedingungen" },
};

export default function LocationBedingungenPage() {
  return (
    <LegalPage
      title="Nutzungsbedingungen für Locations"
      sections={[...LOCATION_TERMS_SECTIONS, ...JOINT_CONTROLLER_SECTIONS]}
      notice={TERMS_DRAFT ? TERMS_DRAFT_NOTICE : undefined}
    />
  );
}
