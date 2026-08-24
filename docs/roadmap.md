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

### Kleine Bars/Pubs unterstützen
**Status:** blocked — braucht zuerst eine Produktentscheidung.

VELVET soll nicht nur für Clubs, sondern auch kleinere Locations (Bars, Pubs) nutzbar
sein. Bisher nur als Idee genannt, nicht spezifiziert: wie eine kleine Bar überhaupt in
die Plattform kommt (vermutlich über bestehende Nutzer, die "ihre Stammkneipe
mitbringen", ähnlich einem Self-Service-Venue-Flow), und ob das eigene Anpassungen am
Venue-Model braucht.

**Offene Frage an Daniel:** Wie soll der Onboarding-Weg für eine kleine Bar konkret
aussehen — Self-Service-Formular durch einen Gast, oder weiterhin nur durch euch
angelegt?

### Neue Rolle "Servicekräfte"
**Status:** blocked — braucht zuerst eine Produktentscheidung.

Eigene, schlankere Rolle für Bar-/Servicepersonal an kleinen Locations, getrennt von
`DOORMAN`/`MANAGER` (siehe `StaffVenueMembership.role` in `server/prisma/schema.prisma`
und `server/prisma/mysql/schema.prisma`). Hängt an "Kleine Bars/Pubs unterstützen" oben.

**Offene Frage an Daniel:** Welche Berechtigungen soll diese Rolle genau haben — nur
Profile ansehen, auch QR-Scans/Bewertungen wie `DOORMAN`, oder auch Team-Verwaltung wie
`MANAGER`?

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

## Neue Punkte hinzufügen

Neue Punkte hier unter `## Open` eintragen (mit klarer Beschreibung und, falls etwas
unklar ist, einer expliziten "Offene Frage an Daniel"-Zeile), sobald eine neue
Feature-Idee aufkommt — diese Datei ist die einzige Sicht der Routine auf das Backlog,
sie hat keinen Zugriff auf Chat-Verlauf oder lokale Notizen.
