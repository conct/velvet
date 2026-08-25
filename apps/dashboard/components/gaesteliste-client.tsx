"use client";

import { useLocale } from "../lib/locale-context";
import { TopicPage } from "./topic-page";

export function GaestelisteClient() {
  const { t } = useLocale();
  return <TopicPage content={t.pages.gaesteliste} />;
}
