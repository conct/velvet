# VELVET — Projektgedächtnis

Kurzorientierung für Claude-Sessions auf diesem Repo. Tiefere Doku liegt in
`docs/`: `docs/deployment.md` (Betrieb), `docs/roadmap.md` (Backlog der
automatisierten wöchentlichen Routine), `docs/handoff.md` (Einstieg
für Menschen: Adressen, lokales Setup, Test-Zugänge, Rollen).

Monorepo, npm Workspaces: `apps/dashboard` (Next.js), `apps/mobile`
(Expo/React Native), `server` (Express + Prisma), `packages/shared`
(gemeinsame Typen/i18n — wird als **kompiliertes** Package konsumiert, nach
jeder Änderung `npm run build --workspace=@velvet/shared`).

## Deploy — Web (Dashboard, API, Mobile-Web-Export)

Manuell, kein CI/CD. Builds werden **lokal** erzeugt und per `scp`/`tar` auf
Uberspace hochgeladen — genauer Ablauf inkl. aller Fallstricke
(`.env.local`-Falle im Dashboard-Build, `--clear` bei `expo export`, sicherer
API-Restart über `dist_new`) steht in `docs/deployment.md`.

**Nicht auf dem Uberspace-Server selbst bauen** — zu wenig RAM, ein nativer
Build ist dort bereits gescheitert (24.08.2026). Ein automatisierter
GitHub-Actions-Runner *auf* Uberspace wurde deswegen am selben Tag versucht
und wieder verworfen. Bei einem erneuten Automatisierungs-Anlauf zuerst
klären, ob der Build auf einer stärkeren Maschine läuft (z.B. gehosteter
GitHub-Runner, der nur das fertige Artefakt hochlädt) statt wieder auf dem
Server selbst.

## Deploy — Native App (iOS/Android)

Ausschließlich über EAS (`eas build`), nie auf dem Uberspace-Server.
`preview`-Profil baut ein installierbares APK, `production` ein App Bundle
für den Play Store. Aus einer Remote-Session ohne Gerät/Store-Zugriff nicht
selbst starten — das macht der Nutzer lokal.

## Roadmap-Automatisierung

`docs/roadmap.md` ist die **einzige** Sicht der wöchentlichen Routine
(mittwochs), geparst über die bewusst englischen Marker `## Open`,
`## Done`, `blocked`. Ein `blocked`-Punkt mit offener Frage wird nie
geraten — braucht erst eine Entscheidung des Nutzers.

## Workflow-Konventionen dieses Nutzers

- Direkt pushen/mergen ist der bevorzugte Weg, kein PR-Review-Umweg.
- Mehrere Claude-Sessions arbeiten teils parallel an diesem Repo auf
  unterschiedlichen Branches — vor einem größeren Merge mit
  `list_sessions` prüfen, ob eine andere Session gerade aktiv am selben
  Branch arbeitet, um ihr nicht dazwischenzufunken.
- Aus einer Remote-Cloud-Session ist SSH (Port 22) zu Uberspace nicht
  erreichbar — Deploy/SSH-Aufgaben sind nur über eine lokale Session beim
  Nutzer möglich, nicht von hier aus.
- **Für alles, was sich nicht per Routine automatisieren lässt** (v.a.
  Deploy, da SSH von hier aus nicht erreichbar ist): keine neue
  Infrastruktur dafür bauen (siehe das verworfene Runner-Experiment oben),
  sondern als klare, einfache Befehlsfolge aufbereiten, die der Nutzer
  bzw. seine lokale Session copy-paste ausführen kann. Auf Nachfrage die
  Befehle als Erinnerung erneut auflisten, statt nur auf `docs/` zu
  verweisen.

## Infrastruktur

Uberspace 8 (`velvet@mab.uberspace.de`, SSH-Alias `u8`), Umzug von der alten
`sabic`-Instanz am 24.08.2026 abgeschlossen. Domain `velvet-network.app`
(+ `api.`/`web.`) via INWX-DNS. Vier `systemctl --user`-Services:
`velvet-api`, `velvet-dashboard`, `velvet-app`, `velvet-mail-relay`.
