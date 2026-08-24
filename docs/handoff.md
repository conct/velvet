# Handoff

Einstiegsdokument für alle, die VELVET übernehmen, mitentwickeln oder nur
kurz etwas nachschauen wollen. Der Rest der Doku geht in die Tiefe
([`deployment.md`](deployment.md) für Betrieb, [`roadmap.md`](roadmap.md)
für den Backlog) — hier steht, was man am ersten Tag braucht.

## Was VELVET ist

Ein geteiltes Vertrauensnetzwerk für den Türstand. Gäste bauen eine
Reputation auf, die über einen einzelnen Club hinausreicht; Türsteher sehen
beim QR-Scan sofort, wen sie vor sich haben; Betreiber fangen nicht jeden
Abend bei null an.

Drei Anwendungen, ein Monorepo, npm Workspaces:

| Pfad | Was es ist |
| --- | --- |
| `apps/dashboard` | Next.js-Dashboard für Betreiber + öffentliche Website |
| `apps/mobile` | Expo/React-Native-App für Gäste und Staff (iOS, Android, Web) |
| `server` | Express-API + Prisma (SQLite lokal, MySQL produktiv) |
| `packages/shared` | Typen, Übersetzungen, Theme — von allen dreien genutzt |

`packages/shared` wird als **kompiliertes** Package konsumiert. Nach jeder
Änderung dort `npm run build --workspace=@velvet/shared`, sonst sehen die
anderen Workspaces den alten Stand.

## Adressen

| Was | Wo |
| --- | --- |
| Website + Dashboard | https://velvet-network.app |
| API | https://api.velvet-network.app |
| Gast-App im Browser | https://web.velvet-network.app |
| App Store | https://apps.apple.com/app/id6803371691 |
| Google Play | https://play.google.com/store/apps/details?id=space.feif.velvet |
| Repository | https://github.com/conct/velvet |

Bundle-ID und Android-Package sind beide `space.feif.velvet`. Welche
Download-Quellen die Website anzeigt, steht in
`apps/dashboard/lib/app-downloads.ts` — das APK wird bewusst nur auf Anfrage
per Mail herausgegeben, nicht gehostet.

| Infrastruktur | Wo |
| --- | --- |
| Hosting | Uberspace 8, `velvet@mab.uberspace.de`, SSH-Alias `u8` |
| DNS | INWX, `*.velvet-network.app` |
| Datenbank | MySQL/MariaDB `velvet` auf demselben Uberspace |
| Mail | `mail@velvet-network.app` (SMTP + IMAP, beides auf U8) |
| Zahlungen | Stripe und PayPal (Live-Credentials) |

Vier systemd-Services (`systemctl --user`): `velvet-api` (6301),
`velvet-dashboard` (6302), `velvet-app` (6303) und `velvet-mail-relay`
(kein Port, pollt IMAP alle 20 s).

## Lokal starten

```bash
npm install
npm run build --workspace=@velvet/shared
```

`server/.env` anlegen — lokal reicht SQLite, es braucht keine echten Secrets:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="irgendein-langer-lokaler-wert"
PORT=4000
```

Datenbank aufsetzen und mit Demo-Daten füllen:

```bash
cd server
npx prisma db push
npm run seed
npm run set-platform-admin -- manager@noir.club   # optional, s.u.
```

Dann aus dem Repo-Root:

```bash
npm run dev:server      # API,       http://localhost:4000
npm run dev:dashboard   # Dashboard, http://localhost:3000
npm run dev:mobile      # Expo Dev Server
```

Ohne `SMTP_HOST` verschickt die API keine Mails, sie schlägt aber auch nicht
fehl — Passwort-Reset- und Bestätigungslinks landen dann einfach nirgends.
Für Flows, die eine Mail brauchen, den Link aus der Datenbank
(`PasswordResetToken`, `EmailVerificationToken`) ziehen oder SMTP-Daten
eintragen.

## Test-Zugangsdaten

Die legt `server/prisma/seed.ts` an. Sie gelten **nur für die lokale
SQLite-Datenbank** — nichts davon existiert produktiv, und die Passwörter
stehen ohnehin im Klartext im Repo. Nie für echte Accounts wiederverwenden.

**Staff (Dashboard, `/login`)**

| Konto | Rolle | Passwort |
| --- | --- | --- |
| `manager@noir.club` | Manager bei Noir Club Berlin **und** Velvet Lounge Hamburg — der Account zum Testen des Location-Wechsels | `manager123` |
| `tuer@noir.club` | Türsteher, Noir Club Berlin | `doorman123` |
| `manager@velvet-hh.club` | Manager, Velvet Lounge Hamburg | `manager123` |
| `tuer@velvet-hh.club` | Türsteher, Velvet Lounge Hamburg | `doorman123` |

Ein Konto für die neue Rolle `SERVICE` legt der Seed nicht an — im Dashboard
unter *Team* eins anlegen, oder das Rollenfeld in `seed.ts` ergänzen.

Platform-Admin (sieht *Locations prüfen* und *Bewerbungen*) ist niemand von
Haus aus. Einmalig setzen:

```bash
cd server && npm run set-platform-admin -- manager@noir.club
```

**Gäste (Mobile-App)** — alle mit `guest1234`, jeweils ein Tier abgedeckt. Sie
sind bereits verifiziert und haben ein Platzhalter-Profilfoto, sonst käme man
weder am Login noch am QR-Code vorbei:

| Konto | Stufe |
| --- | --- |
| `lena@example.com` | VIP |
| `max@example.com` | Vertraut |
| `mia@example.com` | Standard (hat beide Locations besucht) |
| `tom@example.com` | Beobachtung |
| `ben@example.com` | Gesperrt (an zwei Locations als BANNED geflaggt) |

**Sandbox** — eine zweite, vollständig abgeschottete Welt, in der nichts
zählt, was dort passiert:

| Konto | Rolle | Passwort |
| --- | --- | --- |
| `review@velvet-network.app` | Manager der Location „VELVET Testbühne" | `review123` |
| `review-gast@velvet-network.app` | Gast | `review123` |

Ein Sandbox-Login kann keinen echten Gast scannen, bewerten oder sperren — und
umgekehrt. Warum das nötig ist und wie man es produktiv einrichtet, steht unter
„Test-Zugänge: die Sandbox-Welt" in [`deployment.md`](deployment.md).

**Store-Reviewer** (`playstore-review@feif.space`,
`staff-review@feif.space`) sind echte Produktions-Accounts für die
Google-/Apple-Prüfer. Sie stehen absichtlich nicht im Seed; ihre Passwörter
liegen in der Google Play Console bzw. App Store Connect. Sie gehören in die
Sandbox — siehe oben.

## Rollen

Die Berechtigungstabelle steht an genau einer Stelle:
`staffRolePermissions` in `packages/shared/src/types.ts`. Server
(`requireManager` / `requireScanner`) und Dashboard lesen beide daraus.

| Rolle | Gäste ansehen | Scannen/Bewerten | Team & Einstellungen |
| --- | --- | --- | --- |
| `MANAGER` | ja | ja | ja |
| `DOORMAN` | ja | ja | nein |
| `SERVICE` | ja | ja | nein |

`SERVICE` ist die schlankere Rolle für Bar-/Servicepersonal an kleinen
Locations. Sie kann heute dasselbe wie `DOORMAN` und ist trotzdem eigenständig,
damit die Teamliste ehrlich bleibt und die Rechte später getrennt verschiebbar
sind.

Daneben gibt es das Flag `isPlatformAdmin` auf `StaffAccount` — unabhängig von
der Venue-Rolle, schaltet die beiden Admin-Bereiche frei.

## Wie eine Location reinkommt

Zwei Wege, beide enden bei einer geprüften `Venue`:

1. **Self-Service:** Bewerbung über `/location-anmelden` inklusive Upload der
   Gewerbeanmeldung. Ein Platform-Admin prüft sie unter `/admin/applications`,
   und erst die Freigabe legt Location und Manager-Konto an. Das Konto bekommt
   einen Link zum Passwort-Setzen, nie ein Passwort per Mail.
2. **Durch Staff angelegt:** über *Location hinzufügen* im Dashboard. Die
   Location startet als `PENDING` und muss unter `/admin/venues` freigegeben
   werden, bevor QR-Einlass und Bewertungen dort funktionieren.

Hochgeladene Gewerbeanmeldungen liegen in `server/private-uploads/` und werden
**nie** statisch ausgeliefert — im Gegensatz zu `server/uploads/` (Profilfotos,
öffentlich unter `/uploads`). Der einzige Weg an ein Dokument führt über die
Admin-Route.

## Secrets

Nichts Produktives liegt im Repo. `JWT_SECRET`, `DATABASE_URL` und die
SMTP-Daten stehen ausschließlich in `~/velvet-api/server/.env` auf `u8`.
Stripe- und PayPal-Credentials ebenso. Wer die braucht, kommt über den
SSH-Zugang dran — es gibt keine zweite Kopie.

## Drei Fallstricke, die Zeit kosten

1. **Zwei Prisma-Schemas.** `server/prisma/schema.prisma` (SQLite, lokal) und
   `server/prisma/mysql/schema.prisma` (Produktion) werden von Hand synchron
   gehalten. Lokal wird nur das erste automatisch geprüft. Vor dem Deploy:
   `DATABASE_URL="mysql://x:x@localhost/x" npx prisma validate --schema=prisma/mysql/schema.prisma`
2. **`.env.local` im Dashboard** überschreibt `.env.production` beim Build
   unbemerkt. Vor einem Produktions-Build wegschieben und danach im Bundle
   verifizieren, welche API-URL tatsächlich eingebacken wurde.
3. **`expo export` braucht `--clear`.** Metros Cache ist nicht nach dem
   `EXPO_PUBLIC_*`-Wert geschlüsselt — ohne `--clear` wird stillschweigend ein
   Bundle mit einer alten API-URL wiederverwendet, egal was man übergibt.

Alle drei sind in [`deployment.md`](deployment.md) ausführlich beschrieben,
zusammen mit dem kompletten Deploy-Ablauf (manuell, kein CI/CD) und dem
sicheren Restart-Verfahren für die API.

## Stand

Live: QR-Einlass mit Bewertungen, Trust-Score über alle Locations,
Premium-Abos (Stripe/PayPal), Chat mit Invite-Codes und Annahme-Pflicht,
personalisiertes E-Mail-Relay, Pflicht-Profilfoto mit Qualitätscheck,
Self-Service-Bewerbung für Locations, Rolle `SERVICE`.

Der Backlog steht in [`roadmap.md`](roadmap.md) und ist die einzige Sicht der
wöchentlichen Entwicklungsroutine darauf — neue Ideen gehören dort unter
`## Open`, nicht in einen Chat-Verlauf.
