# Roadmap

Backlog for the automated weekly development routine (and anyone else picking up work).
Each item has a status; the routine picks the next `open` item it can act on without
guessing product decisions, implements it on a feature branch, and opens a PR. Items
marked `blocked` need a decision from Daniel before any code should be written for them
— if you're the automated routine and every remaining item is `blocked`, open a GitHub
issue asking the specific open question(s) instead of guessing, and stop.

## Open

### Kleine Bars/Pubs unterstützen
**Status:** blocked — needs product decision first.

VELVET soll nicht nur für Clubs, sondern auch kleinere Locations (Bars, Pubs) nutzbar
sein. Bisher nur als Idee genannt, nicht spezifiziert: wie eine kleine Bar überhaupt in
die Plattform kommt (vermutlich über bestehende Nutzer, die "ihre Stammkneipe
mitbringen", ähnlich einem Self-Service-Venue-Flow), und ob das eigene Anpassungen am
Venue-Model braucht.

**Open question for Daniel:** Wie soll der Onboarding-Weg für eine kleine Bar konkret
aussehen — Self-Service-Formular durch einen Gast, oder weiterhin nur durch euch
angelegt?

### Neue Rolle "Servicekräfte"
**Status:** blocked — needs product decision first.

Eigene, schlankere Rolle für Bar-/Servicepersonal an kleinen Locations, getrennt von
`DOORMAN`/`MANAGER` (siehe `StaffVenueMembership.role` in `server/prisma/schema.prisma`
und `server/prisma/mysql/schema.prisma`). Hängt an "Kleine Bars/Pubs unterstützen" oben.

**Open question for Daniel:** Welche Berechtigungen soll diese Rolle genau haben — nur
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

## Adding new items

Add new `Open` entries here (with a clear description and, if anything is ambiguous,
an explicit "Open question" line) whenever a new feature idea comes up — this file is
the routine's only view into the backlog, it has no access to chat history or local
notes.
