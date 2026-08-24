import { GUEST_TERMS_SECTIONS, TERMS_DRAFT, TERMS_DRAFT_NOTICE } from "@velvet/shared";
import { LegalScreen } from "../../components/legal-screen";

export default function AgbScreen() {
  return (
    <LegalScreen
      title="Allgemeine Geschäftsbedingungen"
      sections={GUEST_TERMS_SECTIONS}
      notice={TERMS_DRAFT ? TERMS_DRAFT_NOTICE : undefined}
    />
  );
}
