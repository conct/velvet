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

_Aktuell nichts offen._

## Done

- ~~Gast-App "Locations"-Liste zu lang~~ — gefiltert auf besuchte Standorte + Suche,
  live seit 2026-08-20.
- ~~Teilen-Funktion mit QR-Code + Link~~ und ~~Chat erst nach Annahme~~ — Invite-Codes +
  accept-gated Messaging, Backend + Mobile-UI live seit 2026-08-21.
- ~~Manager-Nachrichten an VIP/Premium-Gäste~~ — Backend live seit 2026-08-21.
- ~~Pflicht-Profilfoto mit Qualitätscheck~~ — live seit 2026-08-21.
- ~~Personalisiertes Email-Relay (`<code>@velvet-network.app`)~~ — voll live seit
  2026-08-24, inkl. per-Nutzer-IMAP-Ordnern für Accountlöschung.
- ~~Kleine Bars/Pubs unterstützen~~ — Entscheidung von Daniel (2026-08-24):
  Self-Service-Formular, aber mit Verifizierung per Gewerbeanmeldung; angelegt wird
  die Location weiterhin von uns. Umgesetzt als öffentliches Formular
  `/location-anmelden` + Admin-Prüfung unter `/admin/applications`, siehe
  "Location-Bewerbungen" in `docs/deployment.md`.
- ~~Neue Rolle "Servicekräfte"~~ — Entscheidung von Daniel (2026-08-24): darf Profile
  ansehen und Scans/Bewertungen vornehmen, keine Team-Verwaltung. Umgesetzt als Rolle
  `SERVICE`; die Berechtigungstabelle steht in `packages/shared/src/types.ts`
  (`staffRolePermissions`).

## Neue Punkte hinzufügen

Neue Punkte hier unter `## Open` eintragen (mit klarer Beschreibung und, falls etwas
unklar ist, einer expliziten "Offene Frage an Daniel"-Zeile), sobald eine neue
Feature-Idee aufkommt — diese Datei ist die einzige Sicht der Routine auf das Backlog,
sie hat keinen Zugriff auf Chat-Verlauf oder lokale Notizen.
