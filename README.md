# VELVET

Geteiltes Vertrauensnetzwerk für den Türstand: Gäste bauen sich eine Reputation auf, die über einen
einzelnen Club hinausreicht. Türsteher sehen beim Scan sofort, wen sie vor sich haben. Betreiber
schützen ihr Haus, ohne jeden Abend bei null anzufangen.

- Web: [velvet-network.app](https://velvet-network.app)
- API: `api.velvet-network.app`
- Mobile Web (Gast-App): `web.velvet-network.app`

## Struktur

Monorepo mit npm Workspaces:

| Pfad | Beschreibung |
| --- | --- |
| `apps/dashboard` | Next.js Dashboard für Location-Betreiber (Web) |
| `apps/mobile` | Expo/React-Native App für Gäste und Staff (iOS, Android, Web) |
| `server` | Express-API + Prisma (SQLite lokal, MySQL produktiv) |
| `packages/shared` | Gemeinsame Typen/Übersetzungen, von Dashboard, Mobile und Server genutzt |

## Loslegen

```bash
npm install
npm run dev:server      # API, http://localhost:4000
npm run dev:dashboard   # Dashboard, http://localhost:3000
npm run dev:mobile      # Expo Dev Server
```

## Dokumentation

Die vollständige Betriebsdokumentation liegt in [`docs/`](docs/):

- [`docs/handoff.md`](docs/handoff.md) — Einstieg: Adressen, lokales Setup, Test-Zugangsdaten, Rollen, Fallstricke
- [`docs/deployment.md`](docs/deployment.md) — Hosting-Setup, Secrets, Deploy-Ablauf, Datenbank-Migrationen, Native-Builds
- [`docs/roadmap.md`](docs/roadmap.md) — Backlog der wöchentlichen Entwicklungsroutine
