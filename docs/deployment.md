# Deployment

VELVET läuft produktiv auf Uberspace 8 (`velvet@mab.uberspace.de`, SSH-Alias
`u8`), seit dem Umzug von der alten, gemeinsam genutzten Uberspace-7-Instanz
(`sabic`) am 2026-08-24. Grund für den Umzug: `sabic` lief auf CentOS7 mit
glibc 2.17, was wiederholt echte Probleme verursacht hat (Next.js' Turbopack
brauchte `--webpack`, `sharp` segfaultete). U8 ist Arch-basiert mit einem
modernen, rollenden glibc (aktuell 2.44) — dieses ganze Problemfeld ist damit
weg. `sabic` läuft als kurzfristiges Fallback noch, sollte aber nicht mehr für
neue Deploys benutzt werden.

## Domains

| Domain | Zeigt auf | Läuft als |
|---|---|---|
| `velvet-network.app` | Dashboard (Web) | systemd `velvet-dashboard`, Port 6302 |
| `web.velvet-network.app` | Mobile-App (Web-Export) | systemd `velvet-app`, Port 6303 |
| `api.velvet-network.app` | Backend-API | systemd `velvet-api`, Port 6301 |
| — (kein Web-Zugriff) | E-Mail-Relay-Watcher | systemd `velvet-mail-relay` (kein Port, pollt IMAP) |

Die alten `*.feif.space`-Alias-Domains (aus der `sabic`-Zeit) existieren auf
U8 nicht mehr — `velvet-network.app` (+ `api.`/`web.`) ist die einzige Domain.

DNS für `*.velvet-network.app` liegt bei **INWX**. A/AAAA-Records zeigen auf
die U8-IPs (`185.139.158.51` / `2a0b:20c0:2000:62:be24:11ff:fed3:4dd8`).

## Kein kontoweiter CORS-Header-Workaround mehr nötig

Auf `sabic` gab es einen bestehenden, kontoweiten Header
(`Access-Control-Allow-Origin: https://www.choozy.io`) von einem anderen
Projekt auf demselben (geteilten) Account, der einen Override pro
VELVET-Domain nötig machte. U8 ist ein dedizierter, VELVET-only Account —
dieses Problem existiert dort nicht (bestätigt via `uberspace web header
list`, zeigt nichts Kontoweites). Die App-eigene `ALLOWED_ORIGINS`-Allowlist
in `server/src/index.ts` reicht allein aus, kein `uberspace web header set`
nötig.

`web.velvet-network.app` bekommt weiterhin `X-Robots-Tag: noindex, nofollow`,
damit die Mobile-Web-Version nicht von Suchmaschinen indexiert wird — ergänzt
durch `apps/mobile/public/robots.txt` (`Disallow: /`):

```bash
uberspace web header add 'web.velvet-network.app/' X-Robots-Tag 'noindex, nofollow'
```

## Datenbank

MySQL/MariaDB, Datenbank `velvet` (Uberspace-eigene Instanz, automatisch beim
Account-Setup angelegt, lokal via Unix-Socket/`localhost:3306`). Zugangsdaten
liegen serverseitig in `~/.my.cnf` (Client-Config, nicht direkt als
`DATABASE_URL` verwendbar, aber die Werte daraus gehen in `server/.env`).
Schema unter `server/prisma/mysql/` — separat vom lokalen SQLite-Schema
(`server/prisma/schema.prisma`), da es auf diesem Windows-Dev-Rechner keine
lokale MySQL-Instanz gibt.

## Secrets

`JWT_SECRET`, `DATABASE_URL` sowie die SMTP-Zugangsdaten (`SMTP_HOST`,
`SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_SECURE`) liegen
ausschließlich in `~/velvet-api/server/.env` auf dem Server, nicht im Repo.
Alle wurden beim U8-Umzug frisch generiert, keine Wiederverwendung der alten
`sabic`-Secrets. SMTP läuft über die neue Mailbox `mail@velvet-network.app`
auf dem U8-Account — für Passwort-Reset, Registrierungs-Bestätigung und alle
sonstigen Transaktions-Mails (`server/src/lib/mailer.ts`).

Stripe- und PayPal-Zugangsdaten sind Live-Zahlungsanbieter-Credentials und
wurden 1:1 vom alten Server übernommen (nicht rotiert) — anders als
JWT/SMTP/DB sind das keine host-spezifischen Secrets.

## Deploy-Ablauf (manuell, kein CI/CD)

Kein automatisiertes Deployment — Builds werden lokal erzeugt und per
`scp`/`tar` auf den Server kopiert:

1. **Backend**: `npm run build` in `packages/shared/` und `server/`, dann
   Upload von Root-`package.json`+`package-lock.json` +
   `packages/shared/{package.json,dist}` +
   `server/{package.json,dist,src,prisma}` nach `~/velvet-api/` auf `u8`
   (raw `src/` wird mit hochgeladen, nicht nur `dist/` — wird für
   `tsx`-basierte Einmal-Skripte in `server/scripts/` gebraucht, z.B.
   `send-email.ts`). `npm install` auf dem Server (volle Installation, nicht
   `--omit=dev` — `tsx`/`prisma`-CLI werden dort gebraucht), danach
   `npx prisma generate --schema=prisma/mysql/schema.prisma`.
2. **Dashboard**: `NEXT_PUBLIC_API_URL=https://api.velvet-network.app npx
   next build` in `apps/dashboard/` (**`.env.local` vorher wegverschieben** —
   überschreibt sonst `.env.production` unbemerkt; mit
   `grep -rl "api.velvet-network.app" .next/static/chunks/*.js` vor dem
   Upload verifizieren), `.next/` (ohne `.next/cache`) + `app/` +
   `components/` + `public/` + `lib/` hochladen,
   `systemctl --user restart velvet-dashboard`.
3. **Mobile-Web**: `EXPO_PUBLIC_API_URL=https://api.velvet-network.app npx
   expo export --platform web --clear` in `apps/mobile/`. **`--clear` ist
   Pflicht** — Metros Transform-Cache ist nicht nach dem
   `EXPO_PUBLIC_*`-Wert geschlüsselt, ohne `--clear` wird stillschweigend ein
   alter Bundle mit einer früheren URL wiederverwendet, egal welchen Wert man
   übergibt. Danach mit
   `grep -o "api\.velvet-network\.app\|localhost:4000" dist/_expo/static/js/web/*.js`
   verifizieren, was tatsächlich eingebacken wurde, bevor hochgeladen wird.
   `dist/`-Inhalt nach `~/html/velvet-app/` (Zielordner vorher leeren, nicht
   nur überlagern), `systemctl --user restart velvet-app`.

`@velvet/shared` braucht dafür einen echten Build-Schritt (`npm run build`
dort), da `server`, `apps/dashboard` und `apps/mobile` es als kompiliertes
Package konsumieren, nicht als rohe TypeScript-Quelle. Beide Server-Deploy-
Ziele (`velvet-api`, `velvet-dashboard`) haben eine eigene
`packages/shared/`-Kopie auf dem Server — bei Änderungen an Shared-Typen
beide aktualisieren.

**Sicherer Restart-Ablauf (API):** neuen `dist/` erst nach
`~/velvet-api/server/dist_new` hochladen (nicht direkt über `dist/`
drüberkopieren), dann **manuell** testen, bevor `systemctl` angefasst wird:
`ssh u8 "cd velvet-api/server && node dist_new/src/index.js"` — ein
`EADDRINUSE`-Fehler ist normal (der alte Prozess läuft ja noch) und bestätigt
nur, dass der neue Code sauber startet. Danach `dist` → `dist.bak`,
`dist_new` → `dist`, erst dann `systemctl --user restart velvet-api`.

**`npm install` auf U8 kann Postinstall-Skripte stillschweigend blockieren**
(`npm warn install-scripts` statt eines harten Fehlers) — betrifft u.a.
`@prisma/client`, `@prisma/engines`, `prisma`, `esbuild`. Nach jedem frischen
`npm install` auf dem Server auf diese Warnung achten und
`npm install-scripts approve <pkg>` für jedes betroffene Paket ausführen,
dann `npm install` erneut — sonst schlagen nachgelagerte Schritte
(`prisma generate`, `tsx`) mit verwirrenden Fehlern fehl.

**Glibc-Probleme von `sabic` gehören der Vergangenheit an** (glibc 2.44 auf
U8, `ldd --version`): `next build` läuft mit dem Standard-Turbopack, kein
`--webpack` mehr nötig. `sharp` (Bildverarbeitung, für die
Helligkeits-/Kontrast-Prüfung in `server/src/lib/photo-verification.ts`)
läuft ebenfalls anstandslos — auf `sabic` hatte das mit `SIGSEGV`
segfaultet. Trotzdem gilt die Vorsicht bei neuen nativen Dependencies
grundsätzlich weiter: den obigen manuellen Testschritt nicht überspringen.

**Zwei Prisma-Schemas, nur eines wird lokal automatisch geprüft:**
`server/prisma/schema.prisma` (SQLite, für `npx tsc`/`prisma generate`/`prisma
db push` ohne `--schema`-Flag) und `server/prisma/mysql/schema.prisma`
(Produktion) müssen von Hand synchron gehalten werden. Bei Änderungen an
Relationen (nicht nur neue Spalten) vor dem Deploy zusätzlich validieren:
`DATABASE_URL="mysql://x:x@localhost/x" npx prisma validate
--schema=prisma/mysql/schema.prisma` (Fake-Connection-String reicht, `validate`
braucht keine echte DB) — sonst schlägt der Fehler erst beim `db push` gegen
die echte Produktions-DB auf.

**`apps/dashboard/public/material/` ist absichtlich schreibgeschützt**
(Modus `500`, kein Schreibzugriff auch für den Besitzer) — Schutz gegen
versehentliches Überschreiben der Werbematerial-PDFs. Vor jedem Upload dorthin
entsperren, danach wieder sperren:
```bash
ssh u8 "chmod u+w ~/velvet-dashboard/apps/dashboard/public/material"
# scp ...
ssh u8 "chmod 500 ~/velvet-dashboard/apps/dashboard/public/material"
```
(`ls -l` zeigt das als `dr-x------` — das `d` davor ist nur `ls`' Dateityp-Marker,
nicht Teil des `chmod`-Arguments; der tatsächliche Modus ist `500`.)

## Schema-Änderungen mit Data Loss (z.B. Spalten droppen)

`prisma db push` (Prod-Weg, kein CI/CD, keine Migration-History) hat keinen
Backfill-Hook. Ein `ADD COLUMN ... DEFAULT` wird sofort auf **alle**
bestehenden Zeilen angewendet, und ein `DROP COLUMN` mit
`--accept-data-loss` löscht Daten sofort, ohne Rückfrage zum Inhalt. Für
jede Schema-Änderung, die eine bestehende Spalte umzieht oder droppt (nicht
für rein additive Änderungen — die sind ein normaler `db push`), gilt daher
diese zweistufige Reihenfolge, erprobt beim Multi-Venue-Rollout
(2026-08-20):

1. **Backup**: `mysqldump velvet > ~/backups/<name>_<timestamp>.sql`
   auf dem Server — es gibt keine Migration-History, der Dump ist der
   einzige Rollback-Weg.
2. **Additiver Push**: Schema-Datei mit den neuen Spalten/Tabellen, aber
   den alten (noch nicht gelöscht) hochladen und pushen
   (`prisma db push --schema=... --skip-generate`). Kein
   `--accept-data-loss` nötig, wenn wirklich nur additiv.
3. **Backfill**, bevor neuer Code deployed wird: einmaliges Skript, das die
   alten Spalten in die neue Struktur überführt (Vorbild:
   `server/scripts/backfill-staff-venue.ts`, per `tsx` gegen den Server
   ausgeführt). Idempotent schreiben, damit ein erneuter Lauf nicht schadet.
4. **Verifizieren** (Zeilen zählen, Stichprobe der echten Kunden-Accounts
   prüfen), bevor es weitergeht.
5. Neuen Server-Build deployen (Code, der die neue Struktur liest/schreibt,
   alte Spalten aber noch nicht anfasst) — `systemctl --user restart
   velvet-api`.
6. Smoke-Test gegen einen echten Kunden-Account (nicht nur DB-Queries).
7. Zweites Backup, dann destruktiver Push mit der finalen Schema-Datei
   (alte Spalten entfernt) + `--accept-data-loss`.
8. Letzter Smoke-Test.

Lokal (SQLite) gibt es diese Einschränkung nicht — dort kann der Backfill
Teil einer einzigen, hand-geschriebenen `migrate deploy`-Migration sein.

## App-Store-Reviewer-Accounts

`playstore-review@feif.space` (Gast-Account) und `staff-review@feif.space`
(Staff/Manager-Account) werden von den Google/Apple-Reviewern zum Einloggen
benutzt und stehen nicht in `server/prisma/seed.ts` — bei einem
DB-Neuaufbau (wie beim U8-Umzug) müssen sie manuell nachgezogen werden.
Passwort-Hashes migrieren nicht, d.h. bei einem Neuaufbau werden zwangsläufig
neue Passwörter fällig, die dann in Google Play Console und App Store
Connect nachgetragen werden müssen.

## Location-Bewerbungen und `server/private-uploads/`

Kleine Locations (Bars, Kneipen) melden sich selbst über das öffentliche
Formular `/location-anmelden` an und laden dabei ihre Gewerbeanmeldung hoch.
Freigegeben wird **nie automatisch**: ein Platform-Admin sieht die Bewerbung
unter `/admin/applications`, öffnet das Dokument, und erst ein Klick auf
"Freigeben" legt die `Venue` (direkt als `VERIFIED`) plus einen
MANAGER-`StaffAccount` für die Kontaktperson an. Der Account bekommt kein
Passwort per Mail, sondern einen Link zum Selbst-Setzen (derselbe
`PasswordResetToken`-Mechanismus wie "Passwort vergessen", eine Stunde
gültig). Existiert die E-Mail schon als Staff-Account, wird nur eine
MANAGER-Mitgliedschaft ergänzt und keine Mail verschickt.

**Die hochgeladenen Dokumente liegen bewusst nicht in `server/uploads/`.**
Dieses Verzeichnis wird in `server/src/index.ts` per `express.static` unter
`/uploads` öffentlich ausgeliefert — eine Gewerbeanmeldung dort wäre für
jede:n lesbar, der den Dateinamen kennt. Sie landen stattdessen in
`server/private-uploads/`, das nirgends statisch gemountet ist; der einzige
Weg heraus ist die Admin-Route
`GET /admin/venue-applications/:id/document`. Beim Deploy heißt das:

- Das Verzeichnis muss auf dem Server existieren und dem API-User gehören
  (`mkdir -p ~/velvet-api/private-uploads`) — der Prozess legt es sonst beim
  ersten Upload selbst an, aber nur wenn er Schreibrechte im Projektordner hat.
- Es gehört ins Backup neben dem MySQL-Dump; die Datenbank enthält nur den
  Dateinamen, nicht das Dokument.
- Bei einer Absage wird die Datei gelöscht, die Entscheidung samt Grund
  bleibt auf der `VenueApplication`-Zeile stehen.

Das Schema-Update ist rein additiv (neue Tabelle `VenueApplication`), also ein
normaler `prisma db push` ohne `--accept-data-loss`.

## Rollen im Staff-Bereich

`StaffVenueMembership.role` kennt drei Werte, die Berechtigungstabelle dazu
steht an einer Stelle: `staffRolePermissions` in
`packages/shared/src/types.ts`. Server (`requireManager`/`requireScanner` in
`server/src/middleware/auth.ts`) und Dashboard lesen beide daraus.

| Rolle | Gäste ansehen | Scannen/Bewerten | Team & Einstellungen |
| --- | --- | --- | --- |
| `MANAGER` | ja | ja | ja |
| `DOORMAN` | ja | ja | nein |
| `SERVICE` | ja | ja | nein |

`SERVICE` ist die schlankere Rolle für Bar-/Servicepersonal an kleinen
Locations. Sie kann heute dasselbe wie `DOORMAN` und ist trotzdem eine eigene
Rolle, damit die Teamliste ehrlich bleibt (wer steht an der Tür, wer hinterm
Tresen) und die Rechte später getrennt verschoben werden können.

## Personalisiertes E-Mail-Relay

Jede:r Gast hat eine opake `<inviteCode>@velvet-network.app`-Adresse
(derselbe Code wie der Invite-Link, siehe `server/src/lib/relay.ts`). Eine
Nachricht im Chat wird zusätzlich per E-Mail an die echte, registrierte
Adresse des Empfängers gespiegelt (`mail@velvet-network.app` als Absender,
`Reply-To` auf die `<code>@...`-Adresse des Senders). Antwortet die Person
per normalem Mail-Client, landet das auf der Catchall-Adresse
`relay@velvet-network.app`, wird vom systemd-Service `velvet-mail-relay`
(`server/src/relay-watcher.ts`, pollt per IMAP alle 20s) geparst, dem
richtigen Chat zugeordnet und wieder als In-App-Nachricht gespeichert — inkl.
erneutem Zurückspiegeln als E-Mail, sodass ein reiner E-Mail-Nutzer nie in
die App muss.

**Setup auf U8:**
- `relay@velvet-network.app` ist Catchall der Domain (`uberspace mail
  address set relay@velvet-network.app --catchall`) — jede nicht explizit
  vergebene Adresse (also jeder `<code>@...`) landet dort.
- `.env` braucht zusätzlich `RELAY_IMAP_HOST`, `RELAY_IMAP_USER`,
  `RELAY_IMAP_PASS`, `RELAY_DOMAIN`.
- Service: `uberspace service add velvet-mail-relay "node dist/src/relay-watcher.js" --workdir ~/velvet-api/server`.

**Pro-Nutzer-Ordner (wichtig für Kontolöschung):** Korrespondenz wird nicht
flach abgelegt, sondern pro Nutzer in einen eigenen IMAP-Ordner einsortiert —
eingehend nach `<code>` (Ordner wird beim ersten Gebrauch angelegt), ausgehend
archiviert nach `Sent.<code>`. Löscht ein Nutzer sein Konto
(`DELETE /users/me`), räumt `deleteRelayFolders()` in `server/src/lib/mailer.ts`
beide Ordner weg. **Trennzeichen ist `.`, nicht `/`** — dieser Mailserver
lehnt `/` in Mailbox-Pfaden mit `CANNOT`/`Invalid mailbox name` ab; per
`client.list()`s `delimiter`-Feld bestätigt, kein allgemeines IMAP-Gesetz,
also bei einem Hosting-Wechsel neu prüfen.

**Bekannte Einschränkung:** `mail@velvet-network.app`-Passwort-Resets
(`uberspace mail address set --password`) brauchen ein paar Sekunden, bis sie
serverseitig greifen — direkt danach getestete SMTP-Auth kann kurz mit `535
Authentication failed` fehlschlagen, obwohl das Passwort korrekt ist. Vor
einem erneuten Reset lieber 10-15s warten und nochmal testen.

## Test-Zugänge: die Sandbox-Welt

Die Zugangsdaten der App-Store-Reviewer-Accounts stehen in Formularen bei
Google und Apple. Sie sind damit faktisch öffentlich — und ein öffentlicher
Login darf keine echten Gäste anfassen können. Ungeschützt könnte er einen
beliebigen Gast scannen, mit einem Stern bewerten und als `BANNED` flaggen;
zwei sperrende Locations lösen `isNetworkBanned()` aus und der Mensch kommt an
keiner Tür des Netzwerks mehr rein.

Deshalb gibt es ein `isDemo`-Flag auf `User`, `StaffAccount` und `Venue`. Die
Logik dazu steht vollständig in `server/src/lib/demo.ts`. Das Modell sind zwei
parallele Welten, nicht „echte Daten plus ein paar Zeilen zum Ignorieren":

- **Abschottung beim Schreiben:** `assertSameWorld()` lehnt jeden Scan ab, bei
  dem Location und Gast nicht dieselbe Welt haben — in beide Richtungen, und
  bevor irgendetwas geschrieben wird. Das gilt auch fürs Bestätigen eines
  Profilfotos.
- **Scoping beim Lesen:** Trust-Score, Netzwerksperre, Gästelisten, die eigene
  Location-Historie und das Chat-Matching bleiben in der Welt der jeweils
  fragenden Person.

Gefiltert wird bewusst über das *aktuelle* Flag statt über eine Kopie auf
jeder Zeile. Ein Account nachträglich als Demo zu markieren entwertet damit
rückwirkend alles, was er bereits geschrieben hat — genau der Fall bei den
Reviewer-Accounts, die es vor diesem Feature schon gab.

Die Sandbox bleibt dabei voll benutzbar: Ein Reviewer scannt, wird bewertet,
sieht seinen Status wandern und die Location in seiner Historie. Nur ist
nichts davon von außen sichtbar oder zählt irgendwo mit.

### Einrichten

```bash
npm run set-demo -- venue <slug-oder-id>        # Location zur Sandbox machen
npm run set-demo -- staff <email>               # Staff-Login
npm run set-demo -- user  <email>               # Gast-Login
npm run set-demo -- staff <email> off           # zurücknehmen
```

Für die Produktion heißt das konkret: eine eigene Sandbox-Location anlegen,
sie und die beiden Reviewer-Accounts (`staff-review@feif.space`,
`playstore-review@feif.space`) als Demo markieren und **den Staff-Reviewer aus
jeder echten Location entfernen** — solange er Mitglied einer echten Location
ist, arbeitet er in deren Welt. Das Skript weist nach dem Markieren einer
Location auf deren noch nicht markierte Staff-Accounts hin.

Sandbox-Locations tauchen nicht in der öffentlichen Location-Liste der Gast-App
auf. Lokal legt `npm run seed` bereits eine an (`VELVET Testbühne` mit
`review@velvet-network.app` / `review123` und dem Gast
`review-gast@velvet-network.app`), damit sich die Abschottung testen lässt.

## Download-Quellen der Gast-App

Welche Bezugsquellen die Landingpage unter `/#app` anzeigt, steht an genau
einer Stelle: `apps/dashboard/lib/app-downloads.ts`. Die Seite rendert nur
konfigurierte Quellen, eine nicht freigeschaltete Listing-URL wird also nie
als toter Link ausgeliefert.

- **App Store:** `APPLE_APP_ID` ist die numerische Apple-ID (App Store
  Connect → App-Informationen → Allgemein). Einen Apple-Link ohne diese ID
  gibt es nicht; auf `null` gesetzt verschwindet die Kachel.
- **Google Play:** die URL ergibt sich aus `android.package` in
  `apps/mobile/app.json`, es ist nichts nachzuschlagen. Schalter ist
  `ANDROID_LISTING_LIVE`.
- **APK:** wird **auf Anfrage** herausgegeben, nicht zum Download gehostet —
  die Kachel ist ein `mailto:` an die Impressums-Adresse. Schalter ist
  `APK_ON_REQUEST`.
- **Web-App:** immer sichtbar, als Rückfalloption für alle, die keinen der
  beiden Stores nutzen können.

### APK für eine Anfrage bauen

Das `preview`-Profil in `apps/mobile/eas.json` baut ein APK (das
`production`-Profil dagegen ein App Bundle, das sich nicht installieren
lässt):

```bash
cd apps/mobile
eas build -p android --profile preview
```

Die fertige Datei aus EAS herunterladen und der anfragenden Person direkt
schicken. Bewusst nicht öffentlich gehostet und nicht im Git — beides würde
Kopien in Umlauf bringen, von denen niemand weiß, wer sie hat.

Drei Dinge, die dabei bekannt sein müssen:

1. **Derselbe Signaturschlüssel wie im Play Store.** Android verweigert ein
   Update zwischen unterschiedlich signierten Builds — wer das APK installiert
   hat, müsste die App deinstallieren (und verliert die lokale Session), um
   später auf die Play-Version zu wechseln. Also dieselben EAS-Credentials
   benutzen, nicht neu generieren lassen.
2. **Keine automatischen Updates.** Ein sideloadetes APK aktualisiert sich
   nie von selbst. Bei einer Pflicht-Änderung an der API bleibt es auf dem
   alten Stand — deshalb notieren, wer eins bekommen hat.
3. **Warnhinweise sind normal.** Android verlangt „Installation aus
   unbekannten Quellen erlauben", und Play Protect zeigt beim Installieren
   einen Hinweis. Das lässt sich nicht abstellen.

## Native Android-Build

`apps/mobile/eas.json` — EAS-Build-Profile (`development`, `preview`,
`production`). `preview`/`production` zeigen ebenfalls auf
`api.velvet-network.app`.
