import { TERMS_DRAFT, TERMS_DRAFT_NOTICE, WIDERRUF_SECTIONS } from "@velvet/shared";
import { LegalScreen } from "../../components/legal-screen";

export default function WiderrufScreen() {
  return (
    <LegalScreen
      title="Widerrufsbelehrung"
      sections={WIDERRUF_SECTIONS}
      notice={TERMS_DRAFT ? TERMS_DRAFT_NOTICE : undefined}
    />
  );
}
