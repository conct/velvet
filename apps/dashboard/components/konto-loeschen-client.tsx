"use client";

import { LegalPage } from "./legal-page";
import { useLocale } from "../lib/locale-context";

export function KontoLoeschenClient() {
  const { t } = useLocale();
  return <LegalPage title={t.legal.kontoLoeschen.title} sections={t.legal.kontoLoeschen.sections} />;
}
