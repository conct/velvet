import { DATENSCHUTZ_SECTIONS } from "@velvet/shared";
import { LegalScreen } from "../../components/legal-screen";

export default function Datenschutz() {
  return <LegalScreen title="Datenschutzerklärung" sections={DATENSCHUTZ_SECTIONS} />;
}
