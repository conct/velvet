import { IMPRESSUM_SECTIONS } from "@velvet/shared";
import { LegalScreen } from "../../components/legal-screen";

export default function Impressum() {
  return <LegalScreen title="Impressum" sections={IMPRESSUM_SECTIONS} />;
}
