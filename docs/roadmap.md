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

### Ausgeblendete Locations im Dashboard wiedereinblenden
**Status:** offen.

Gäste können eine Location dauerhaft aus ihrer Historie nehmen (siehe
`server/src/lib/hidden-venues.ts`). Zurückholen geht bewusst nicht in der App,
sondern nur über `npm run unhide-venue` auf dem Server — bei jeder Support-Anfrage
muss also jemand per SSH ran. Sinnvoll wäre dieselbe Funktion im Admin-Bereich des
Dashboards, neben „Locations prüfen" und „Bewerbungen": Gast per E-Mail suchen,
ausgeblendete Locations sehen, eine davon zurückholen.

Wichtig dabei: Die Liste der ausgeblendeten Locations einer Person ist selbst
sensibel. Sie gehört hinter `requirePlatformAdmin` und sollte nicht nebenbei in
einer allgemeinen Gästesuche auftauchen.

### Benachrichtigung bei neuer Location-Bewerbung
**Status:** offen.

Eine Bewerbung über `/location-anmelden` landet in der Datenbank und wartet.
Gesehen wird sie nur, wenn zufällig jemand ins Dashboard unter
`/admin/applications` schaut. Wer sich am Freitagabend bewirbt, wartet im
Zweifel Tage auf eine Reaktion — und bekommt von uns bis dahin nur die
automatische Eingangsbestätigung.

Naheliegend: eine E-Mail an `mail@velvet-network.app`, sobald eine Bewerbung
eingeht (der Mailer kann das bereits, siehe `sendVenueApplicationReceivedEmail`
als Vorlage). Optional zusätzlich ein Zähler im Dashboard-Menü, damit offene
Bewerbungen sichtbar sind, ohne die Seite aufzurufen.

### Beide Prisma-Schemas automatisch abgleichen
**Status:** offen.

`server/prisma/schema.prisma` (SQLite, lokal) und
`server/prisma/mysql/schema.prisma` (Produktion) werden von Hand synchron
gehalten. Lokal wird nur das erste geprüft, d.h. ein vergessenes Feld im
MySQL-Schema fällt frühestens beim `db push` gegen die Produktions-DB auf —
einer der drei dokumentierten Fallstricke in `docs/deployment.md`.

Ein `npm run check-schemas`, das beide Dateien parst und Models und Felder
vergleicht (Typ-Attribute wie `@db.Text` bewusst ignorierend), würde das vorher
abfangen. Kein CI nötig, ein Skript reicht, das man vor dem Deploy laufen lässt.

### Locations stilllegen können
**Status:** offen.

Eine freigegebene Location lässt sich heute weder deaktivieren noch löschen.
Alle Schreibzugriffe auf `Venue` legen an, benennen um oder setzen `status` auf
`VERIFIED` — zurück geht es nie. Wenn eine Location Hausverbote missbraucht
oder schlicht zumacht, gibt es keinen Schalter, nur Handarbeit in der
Datenbank.

Als Notbehelf wirkt `npm run set-demo -- venue <slug>`: Die Location
verschwindet aus der öffentlichen Liste, ihr Personal kann keine echten Gäste
mehr scannen, ihre Bewertungen zählen nicht mehr. Das ist aber ein
Vorschlaghammer — es entwertet **rückwirkend** die gesamte Bewertungshistorie
dieser Location, auch die berechtigte.

Gebraucht wird ein eigener Zustand, etwa `status: "SUSPENDED"`: Location aus
der öffentlichen Liste nehmen, Scans und Bewertungen dort ablehnen, bereits
vergebene Bewertungen aber **stehen lassen** — sie waren zu ihrer Zeit gültig.
Bedienbar unter `/admin/venues` neben „Freigeben", mit Grund und Datum am
Datensatz.

Der halbe Weg ist inzwischen da: `npm run delete-venue -- <slug>` entfernt eine
Location, die **nie in Betrieb war** — Tippfehler, abgebrochene Bewerbungen,
Testeinträge. Sobald Scans oder Bewertungen daran hängen, verweigert das Skript
und verweist auf `set-demo`. Genau das ist die Lücke, die dieser Punkt schließen
soll: Für eine Location, die tatsächlich gearbeitet hat, gibt es weiterhin nur
den Vorschlaghammer, weil ihre Bewertungen zur Historie der Gäste gehören und
deren Score verändern würden. Stilllegen deckt den dringenden Fall ab.

### Aufbewahrungsfrist für Gewerbeanmeldungen
**Status:** offen.

Wird eine Bewerbung abgelehnt, löschen wir das hochgeladene Dokument sofort.
Wird sie freigegeben, bleibt es dagegen unbefristet in
`server/private-uploads/` liegen. Das ist personenbezogene Unternehmensdaten
ohne definierte Löschfrist — genau das, was eine Datenschutzerklärung
normalerweise benennen muss, und unsere benennt es bisher nicht.

**Entscheidung von Daniel (2026-08-24):** nach Ablauf einer Frist löschen, nicht
dauerhaft aufbewahren — datensparsamer, ein Prüfvermerk genügt als Nachweis.
**Frist: 6 Monate** ab Freigabe der Location. Danach das Dokument aus
`server/private-uploads/` entfernen und stattdessen an der Location Datum der
Prüfung plus prüfende Person vermerken (dieser Vermerk bleibt dauerhaft, nur
das Dokument selbst hat die Frist).

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

## Neue Punkte hinzufügen

Neue Punkte hier unter `## Open` eintragen (mit klarer Beschreibung und, falls etwas
unklar ist, einer expliziten "Offene Frage an Daniel"-Zeile), sobald eine neue
Feature-Idee aufkommt — diese Datei ist die einzige Sicht der Routine auf das Backlog,
sie hat keinen Zugriff auf Chat-Verlauf oder lokale Notizen.
