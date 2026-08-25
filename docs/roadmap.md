# Roadmap

Backlog für die automatisierte wöchentliche Entwicklungsroutine (und für alle anderen,
die einen Punkt aufgreifen wollen). Jeder Punkt hat einen Status; die Routine sucht sich
den nächsten Punkt unter `## Open`, der nicht `blocked` ist und keine offene Frage hat,
setzt ihn auf einem Feature-Branch um und öffnet einen Pull Request. Mit `blocked`
markierte Punkte brauchen erst eine Entscheidung von Daniel, bevor dafür Code
geschrieben wird — falls (als automatisierte Routine) alle verbleibenden Punkte
`blocked` sind, gibt es eine Push-Benachrichtigung mit der konkreten offenen Frage statt
zu raten.

(Die Marker `## Open`, `## Done` und `blocked` bleiben bewusst auf Englisch stehen —
die Routine sucht nach genau diesen Begriffen.)

## Open

### Anwaltliche Prüfung der Rechtstexte
**Status:** blocked — liegt bei Daniel, nicht bei der Routine.

`LOCATION_TERMS_SECTIONS`, `JOINT_CONTROLLER_SECTIONS`, `GUEST_TERMS_SECTIONS` und
`WIDERRUF_SECTIONS` (in `packages/shared/src/terms.ts` und `guest-terms.ts`) sind
Entwürfe. Solange `TERMS_DRAFT = true` ist, tragen alle vier Seiten einen sichtbaren
Entwurfshinweis. Nach der Prüfung: Text ersetzen, `TERMS_DRAFT` auf `false`,
`TERMS_VERSION` hochzählen. Diesen Punkt nicht automatisiert umsetzen.

### Instagram-Posting automatisieren
**Status:** offen — vorerst zurückgestellt.

Die wöchentliche Social-Media-Routine liefert bisher nur Text-Entwürfe (siehe
Trigger "VELVET Social-Media-Entwürfe"), gepostet wird von Hand.

**Entscheidung von Daniel (2026-08-24):** wird nach hinten geschoben, aktuell kein
Interesse an der Integration (weder Meta Graph API direkt noch ein
Drittanbieter-Scheduler). Bleibt bei Text-Entwürfen + manuellem Posten. Diesen
Punkt nicht von selbst wieder aufgreifen — erst wenn Daniel ihn erneut anstößt.

### Rechte der Rolle `SERVICE`
**Status:** erledigt — keine Änderung nötig.

`SERVICE` darf heute exakt dasselbe wie `DOORMAN`: Gäste ansehen, scannen,
bewerten — inklusive `setLocalFlag: "BANNED"`.

**Entscheidung von Daniel (2026-08-24):** so lassen. Ein Hausverbot durch eine
Servicekraft muss für spätere Türsteher sichtbar sein — würde `SERVICE` das
Flaggen fehlen, wüsste ein `DOORMAN` an anderer Stelle nichts von einem bereits
erteilten Hausverbot. Keine Code-Änderung nötig, die aktuelle Berechtigung
(`staffRolePermissions` in `packages/shared/src/types.ts`) bleibt wie sie ist.

## Done

- ~~Zustimmung zu den Location-Nutzungsbedingungen erfassen~~ — seit 2026-08-25:
  Pflicht-Checkbox im Formular `/location-anmelden` mit Link auf
  `/location-bedingungen`, protokolliert als `acceptedTermsVersion` +
  `acceptedTermsAt` auf `VenueApplication` (beide Prisma-Schemas), angezeigt unter
  `/admin/applications` und bei der Freigabe auf die `Venue` übernommen. Die
  Version setzt der Server aus `TERMS_VERSION`, nicht der Client; ohne Zustimmung
  weist auch `POST /venue-applications` ab, nicht nur die UI. Details in
  „Location-Bewerbungen" in `docs/deployment.md`.
- ~~Mindestalter bei der Registrierung~~ — Entscheidung von Daniel (2026-08-25):
  Geburtsdatum erfassen statt bloßer Checkbox. Umgesetzt als `User.dateOfBirth`,
  geprüft in `packages/shared/src/age.ts` (`checkSignupDateOfBirth`) — einmal in der
  App, verbindlich in `POST /auth/register`. Datenschutzerklärung und Gäste-AGB § 2
  sind mitgezogen; Details in „Mindestalter und Widerrufs-Zustimmung" in
  `docs/deployment.md`.
- ~~Widerrufs-Zustimmung im Premium-Checkout~~ — seit 2026-08-25: Pflicht-Checkbox
  über den Bezahl-Buttons, protokolliert in `WithdrawalConsent` mit Wortlaut,
  Sprachfassung und `TERMS_VERSION`. Ohne Zustimmung weist auch
  `POST /subscriptions/checkout` ab, nicht nur die UI.
- ~~Dashboard-UI für Manager-Nachrichten~~ — `/messages` im Dashboard, manager-only,
  gegen die bestehenden `/messages/staff/*`-Endpunkte. Damit ist die Funktion auf
  beiden Seiten bedienbar.
- ~~Gast-App "Locations"-Liste zu lang~~ — gefiltert auf besuchte Standorte + Suche,
  live seit 2026-08-20.
- ~~Teilen-Funktion mit QR-Code + Link~~ und ~~Chat erst nach Annahme~~ — Invite-Codes +
  accept-gated Messaging, Backend + Mobile-UI live seit 2026-08-21.
- ~~Manager-Nachrichten an VIP/Premium-Gäste~~ — Backend live seit 2026-08-21.
- ~~Pflicht-Profilfoto mit Qualitätscheck~~ — live seit 2026-08-21.
- ~~Personalisiertes Email-Relay (`<code>@velvet-network.app`)~~ — voll live seit
  2026-08-24, inkl. per-Nutzer-IMAP-Ordnern für Accountlöschung.
- ~~iOS Universal Links / Android App Links für Invite-Scans~~ — Server-seitige
  Config (`app.json`, `.well-known/apple-app-site-association`,
  `.well-known/assetlinks.json`) live seit 2026-08-24. **Wirkt aber erst nach
  einem neuen `eas build` + Store-Review** — bewusst zurückgestellt auf den
  nächsten Release-Durchlauf, nicht isoliert dafür released.
- ~~Kleine Bars/Pubs unterstützen~~ — Entscheidung von Daniel (2026-08-24):
  Self-Service-Formular, aber mit Verifizierung per Gewerbeanmeldung; angelegt wird
  die Location weiterhin von uns. Umgesetzt als öffentliches Formular
  `/location-anmelden` + Admin-Prüfung unter `/admin/applications`, siehe
  "Location-Bewerbungen" in `docs/deployment.md`.
- ~~Neue Rolle "Servicekräfte"~~ — Entscheidung von Daniel (2026-08-24): darf Profile
  ansehen und Scans/Bewertungen vornehmen, keine Team-Verwaltung. Umgesetzt als Rolle
  `SERVICE`; die Berechtigungstabelle steht in `packages/shared/src/types.ts`
  (`staffRolePermissions`).
- ~~Test-Zugänge von echten Gästen trennen~~ — `isDemo` auf `User`, `StaffAccount` und
  `Venue` als zwei parallele Welten, seit 2026-08-24. Ein Reviewer-Login kann keinen
  echten Gast scannen, bewerten oder sperren. Einrichtung siehe „Test-Zugänge: die
  Sandbox-Welt" in `docs/deployment.md`.
- ~~Locations aus der eigenen Historie ausblenden~~ — dauerhaft, nur per Support
  zurückholbar, seit 2026-08-24. Entscheidung von Daniel: der Trust-Score bleibt davon
  unberührt, und die Location behält ihre eigenen Aufzeichnungen — sonst wäre es ein
  Knopf zum Löschen eines schlechten Abends. Das Premium-Matching lässt ausgeblendete
  Locations in beide Richtungen fallen.
- ~~Ausgeblendete Locations im Dashboard wiedereinblenden~~ — `/admin/hidden-venues`,
  seit 2026-08-24: Gast per exakter E-Mail-Suche finden, ausgeblendete Locations sehen,
  einzeln zurückholen. Kein SSH mehr nötig für diesen Support-Fall; das alte
  `npm run unhide-venue` bleibt als Fallback bestehen.
- ~~Benachrichtigung bei neuer Location-Bewerbung~~ — interne Mail an
  `mail@velvet-network.app` bei jeder neuen Bewerbung, seit 2026-08-24.
- ~~Beide Prisma-Schemas automatisch abgleichen~~ — `npm run check-schemas`, seit
  2026-08-24: vergleicht `schema.prisma` und `prisma/mysql/schema.prisma` Model für
  Model, ignoriert reine Typ-Attribute wie `@db.Text`.
- ~~Locations stilllegen können~~ — `Venue.status = "SUSPENDED"`, seit 2026-08-24:
  `/admin/venues/:id/suspend` + `/reactivate`, bestehende Bewertungen bleiben stehen,
  nur neue Scans/Bewertungen und die öffentliche Liste sind betroffen. Bedienbar unter
  `/admin/venues`.
- ~~Aufbewahrungsfrist für Gewerbeanmeldungen~~ — Entscheidung von Daniel (2026-08-24):
  6 Monate ab Freigabe, danach nur noch Prüfvermerk (Datum + prüfende Person) statt
  Dokument. Umgesetzt als `npm run purge-expired-applications` (kein Cron im Projekt,
  von Hand/beim Deploy laufen lassen), `documentDeletedAt` markiert erledigte Fälle.

## Neue Punkte hinzufügen

Neue Punkte hier unter `## Open` eintragen (mit klarer Beschreibung und, falls etwas
unklar ist, einer expliziten "Offene Frage an Daniel"-Zeile), sobald eine neue
Feature-Idee aufkommt — diese Datei ist die einzige Sicht der Routine auf das Backlog,
sie hat keinen Zugriff auf Chat-Verlauf oder lokale Notizen.
