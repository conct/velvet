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

`web.velvet-network.app` bekommt `X-Robots-Tag: noindex`, damit die
Mobile-Web-Version nicht von Suchmaschinen indexiert wird:

```bash
uberspace web header add 'web.velvet-network.app/' X-Robots-Tag 'noindex'
```

**`apps/mobile/public/robots.txt` darf kein `Disallow: /` enthalten** — das ist
dieselbe Falle wie bei `/making-of` im Dashboard: Ein Crawler muss die Seite
abrufen, um den `noindex`-Header überhaupt zu lesen. Ein `Disallow` verhindert
genau diesen Abruf, versteckt damit die eigene noindex-Anweisung, und die URL
kann aus jedem eingehenden Link trotzdem im Index landen — dann als nackter
Eintrag ohne Snippet. Entweder `Disallow` oder `noindex`, und wirksam ist nur
`noindex`. Das `nofollow` von früher ist ersatzlos entfallen: Bei einer Seite,
die ohnehin nicht in den Index soll, bringt es nichts.

`uberspace web header add` überschreibt einen bestehenden Eintrag nicht,
sondern legt einen zweiten daneben (der Header wird dann doppelt ausgeliefert).
Vor einer Wertänderung erst `uberspace web header del
'web.velvet-network.app/' X-Robots-Tag`, dann neu hinzufügen; `uberspace web
header list` zeigt den Ist-Zustand.

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
   `server/{package.json,dist,src,scripts,prisma}` nach `~/velvet-api/` auf
   `u8`. **`scripts/` gehört ausdrücklich dazu** — die `tsx`-basierten
   Einmal-Skripte (`set-demo`, `sandbox-staff`, `unhide-venue`,
   `send-email`, `set-platform-admin`, `create-staff-account`,
   `delete-venue`) liegen dort, nicht in `src/`. Fehlen
   sie, scheitert jeder `npm run <skript>` auf dem Server mit
   `ERR_MODULE_NOT_FOUND`, obwohl die API selbst tadellos läuft. `src/` wird
   zusätzlich gebraucht, weil die Skripte von dort importieren. `npm install` auf dem Server (volle Installation, nicht
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
   `dist/`-Inhalt nach `~/html/velvet-app/`, `systemctl --user restart
   velvet-app`. **Nicht mit `rm -rf ~/html/velvet-app/*` leeren** — der Glob
   trifft `.well-known/` nicht, und ein Fehlschlag mittendrin liefert einen
   halben Stand aus. Stattdessen daneben entpacken und das Verzeichnis
   tauschen (macht das Skript unten so).

Für Dashboard und Mobile-Web gibt es je ein Skript, das den ganzen Ablauf
inklusive aller Fallstricke abbildet:

```powershell
.\scripts\deploy\dashboard.ps1   # Punkt 2
.\scripts\deploy\app.ps1         # Punkt 3
```

`dashboard.ps1` braucht je nach Netz **deutlich über zehn Minuten** — der
`scp`-Upload von `.next/` besteht aus sehr vielen kleinen Dateien. Nicht
abbrechen, weil es hängen aussieht. Wird der Lauf trotzdem abgebrochen, bleibt
`apps/dashboard/.env.local.bak` liegen; das Skript holt sie beim nächsten Lauf
selbst zurück, aber wer dazwischen lokal entwickelt, steht ohne `.env.local` da.

`app.ps1` schiebt zusätzlich `apps/mobile/.env` weg (sie zeigt auf
`http://localhost:4000` und würde die Produktions-URL verdrängen), bricht ab,
wenn `localhost:4000` im gebauten Bundle auftaucht oder `.well-known/` im
Export fehlt, und prüft nach dem Neustart, ob `web.velvet-network.app` und die
`apple-app-site-association` mit `200` antworten. Für das Backend (Punkt 1)
gibt es kein Skript.

### Wenn der Upload plötzlich in `Connection timed out` läuft

Am 25.08.2026 scheiterte `dashboard.ps1` zweimal beim `scp` mit
`ssh: connect to host mab.uberspace.de port 22: Connection timed out`. Der
Build war einwandfrei, hochgeladen wurde nichts — das Skript bricht beim
ersten Verzeichnis ab, es entsteht also kein halber Stand auf dem Server.

Bevor man am Skript sucht: **prüfen, ob es überhaupt am SSH liegt.** Waren von
der eigenen Maschine aus auch `https://velvet-network.app/` und
`https://api.velvet-network.app/health` tot, über IPv4 *und* IPv6, während ein
beliebiger anderer Host normal antwortete, dann ist nicht der SSH-Dienst weg,
sondern die eigene IP kommt an den Host nicht mehr heran. Gegenprobe von
außerhalb der eigenen Leitung (z.B. Handy im Mobilfunknetz): Antwortet die
Seite dort, läuft der Server und Besucher merken nichts.

Wahrscheinlichste Ursachen sind eine fail2ban-Sperre der eigenen IP nach
abgebrochenen SSH-Verbindungen oder ein Routing-Problem des eigenen
Anschlusses. In beiden Fällen hilft nur warten — **weitere Versuche
verlängern eine fail2ban-Sperre**. Danach `dashboard.ps1` einfach erneut
laufen lassen; das Skript ist wiederholbar und holt eine liegengebliebene
`.env.local.bak` selbst zurück.

### Wenn `web.velvet-network.app` nach dem Deploy 404 liefert

Am 26.08.2026 lief `app.ps1` genau so auf 404: Build sauber, Upload sauber,
Verzeichnistausch gescheitert, Dienst trotzdem neu gestartet — auf ein
Verzeichnis, das es nicht mehr gab.

Ursache waren die **CRLF-Zeilenenden des PowerShell-Here-Strings**, mit dem
das Skript den Tausch per `ssh` an die Bash auf dem Server schickt. Unverändert
übertragen hängt an jeder Zeile ein `\r`:

- aus `set -e` wird `set -e\r` — bash meldet `set: -: invalid option`, und
  **errexit bleibt aus**, alle Folgefehler laufen stumm weiter;
- `mkdir velvet-app.new` legt ein Verzeichnis an, dessen Name auf ein Carriage
  Return endet, und das folgende `mv velvet-app.new velvet-app` findet es
  nicht mehr — `mv: cannot stat`.

Das alte Verzeichnis war zu dem Zeitpunkt schon nach `velvet-app.old` verschoben.
Ergebnis: gar kein `velvet-app` mehr, und der Restart serviert ins Leere.

**Das Skript merkt so einen Fehler nicht von selbst.** `ssh` liefert den
Exit-Status des *letzten* Remote-Befehls — das war der erfolgreiche
`systemctl restart`, also `0`. Die `$LASTEXITCODE`-Prüfung im Skript kann
deshalb nicht greifen; aufgefallen ist es erst am HTTP-Check danach.

Behoben in `scripts/deploy/app.ps1` durch
`$remoteScript = $remoteScript -replace "`r`n", "`n"` vor dem `ssh`-Aufruf.
Die Zeile ist auch dann nötig, wenn die Datei im Arbeitsverzeichnis gerade
LF-Enden hat: bei aktivem `core.autocrlf` holt ein frischer Checkout die CRLF
zurück.

**Erkennen:** `ssh u8 "ls -b ~/html/"` — `ls -b` macht nicht druckbare Zeichen
sichtbar. Ein Eintrag `velvet-app.new\r` ist der Beweis; ein bloßes `ls`
zeigt den Namen unauffällig als `velvet-app.new`.

**Reparieren** (der neue Build ist vollständig da, er liegt nur falsch):

```bash
ssh u8 'set -e; cd ~/html; test ! -e velvet-app; mv velvet-app.new* velvet-app; systemctl --user restart velvet-app'
```

Der Glob `velvet-app.new*` trifft den Namen mitsamt Carriage Return.
`test ! -e velvet-app` verhindert, dass ein zweiter Aufruf den bereits
getauschten Stand nach `velvet-app/velvet-app` hineinschiebt. Danach das
Backup auf einen sauberen Namen ziehen: `mv velvet-app.old* velvet-app.old`.
Zurück geht es mit `mv velvet-app.old velvet-app`.

## Universal Links (iOS) / App Links (Android)

Seit 2026-08-24 konfiguriert, damit ein gescannter `/invite/<code>`-Link auf
einem Gerät mit installierter App die App direkt öffnet statt nur den
Browser-Fallback. Setup:

- `apps/mobile/app.json`: `ios.associatedDomains` (`applinks:web.velvet-network.app`)
  und `android.intentFilters` (autoVerify, `host: web.velvet-network.app`,
  `pathPrefix: /invite`) — beides native Manifest-Einträge, werden nur bei
  einem **neuen EAS-Build + Store-Submission** wirksam, ein reiner
  Web-Redeploy reicht nicht.
- `apps/mobile/public/.well-known/apple-app-site-association` — statischer
  JSON-Inhalt, `appIDs` braucht die Apple **Team-ID** (`2MYFL39UG2` für
  `space.feif.velvet`, aus dem `embedded.mobileprovision` eines bestehenden
  EAS-iOS-Builds extrahiert — steht sonst nirgends im Repo).
- `apps/mobile/public/.well-known/assetlinks.json` — den
  **SHA-256-Zertifikats-Fingerabdruck des Play-App-Signing-Keys** (nicht des
  Upload-Keys) liefert Play Console unter **"Mit Google Play geschützt" →
  Google Play Store-Schutz (aufklappen)** direkt als fertiges JSON-Snippet
  unter "Digital Asset Links-JSON-Datei" — die alte
  Setup-→-App-Integrität-Seite leitet dorthin um. Dieser Wert ist über keine
  API abrufbar, nur über die Play-Console-UI.
- **`express.static()`-Falle**: ignoriert Dotfiles/-Verzeichnisse
  standardmäßig (`dotfiles: 'ignore'`) — `~/velvet-app-server/server.js`
  (dieses Skript existiert nur auf dem Server, nicht im Repo) hat deshalb
  explizite Routes für beide `.well-known`-Dateien vor der
  `express.static`-Middleware, sonst liefert Apple/Google beim
  Verifizieren die `index.html` statt der echten JSON-Datei.
- Verifizieren: `curl -sI https://web.velvet-network.app/.well-known/apple-app-site-association`
  muss `200` + `Content-Type: application/json` liefern, kein Redirect.

`@velvet/shared` braucht dafür einen echten Build-Schritt (`npm run build`
dort), da `server`, `apps/dashboard` und `apps/mobile` es als kompiliertes
Package konsumieren, nicht als rohe TypeScript-Quelle.

**Seit dem 26.08.2026 erledigen die beiden Skripte das selbst.** `dashboard.ps1`
und `app.ps1` übersetzen `@velvet/shared` vor dem jeweiligen Build, und
`dashboard.ps1` lädt die kompilierte `dist/` zusätzlich nach
`~/velvet-dashboard/packages/shared/` hoch. Vorher war beides Handarbeit, und
genau das ging schief: das Dashboard rendert `/impressum` beim Build statisch
vor, die Seite sah also korrekt aus, während die Laufzeit-Kopie auf dem Server
tagelang die alte Fassung behielt — inklusive einer Steuernummer, die aus
Datenschutzgründen entfernt worden war.

`app.ps1` lädt bewusst *keine* Kopie hoch: der Web-Export ist ein statisches
Bundle, dort gibt es zur Laufzeit nichts nachzuladen.

**Für die API bleibt es Handarbeit** — dafür gibt es kein Skript.
`~/velvet-api/packages/shared/` gehört bei jeder Shared-Änderung mit
hochgeladen, sonst laufen die beiden Server-Kopien auseinander. Prüfen lässt
sich der Stand ohne Zeitstempel-Raterei über den Inhalt, z.B.
`ssh u8 "grep -c TERMS_VERSION ~/velvet-api/packages/shared/dist/terms.js"`.

**`scp -r <verzeichnis> ziel/` verschachtelt beim zweiten Mal.** Existiert das
Zielverzeichnis noch nicht, legt `scp` es an — existiert es bereits, kopiert es
*hinein*: Aus `scp -r server/scripts u8:velvet-api/server/` wird beim zweiten
Upload `server/scripts/scripts/`. Der erste Deploy funktioniert also, jeder
weitere legt die Dateien eine Ebene zu tief ab, und `npm run <skript>`
scheitert mit `ERR_MODULE_NOT_FOUND`, obwohl der Upload fehlerfrei durchlief.
Dasselbe gilt für `src/`, `prisma/` und `dist_new`.

Robuste Form für wiederholte Uploads — Verzeichnis sicherstellen, dann den
*Inhalt* kopieren:

```powershell
ssh u8 "mkdir -p ~/velvet-api/server/scripts"
scp -r server\scripts\* u8:velvet-api/server/scripts/
```

Aufräumen, wenn es schon passiert ist:
`mv scripts/scripts/* scripts/ && rmdir scripts/scripts`

**Die Zielverzeichnisse der API sind zwischen Deploys schreibgeschützt.**
`~/velvet-api/server/src`, `.../prisma` und `.../dist` liegen als `dr-x------`
bzw. `drwx------` auf dem Server. Ein Upload scheitert dann nicht beim Schreiben
der Dateien, sondern beim Aufräumen davor: `rm: cannot remove
'src/routes/auth.ts': Permission denied`, zeilenweise für jede Datei — im
eigenen Home-Verzeichnis, was zunächst nach einem kaputten Account aussieht.
Es fehlt nur das Schreibrecht auf dem *Verzeichnis*. Vor jedem API-Upload
deshalb einmal entsperren:

```bash
ssh u8 "chmod -R u+w ~/velvet-api"
```

`dashboard.ps1` macht genau das für seine Zielverzeichnisse schon selbst
("Entsperre Zielverzeichnisse"); für die API gibt es kein Skript, also von
Hand. Beim Packen lokal `tar czf - --mode='u+rwX' ...` verwenden, sonst
wandern dieselben Modi gleich wieder mit hoch.

**`tar xzf` auf dem Server überschreibt nicht.** Ein Entpacken über ein
bestehendes Verzeichnis bricht mit `Cannot open: File exists` ab statt die
Dateien zu ersetzen. Sicherer Weg: in ein Staging-Verzeichnis daneben
entpacken und dann die Verzeichnisse tauschen — das gilt ohnehin für `dist`,
das nie direkt überschrieben werden darf (siehe `dist_new` unten).

**Schema-Änderungen gehören zwischen Upload und Restart.** `prisma db push`
liest das Schema, das *auf dem Server* liegt — läuft es vor dem Upload, pusht
es das alte und meldet „already in sync", ohne etwas zu tun. Richtige
Reihenfolge: hochladen (inkl. `server/prisma/`), `npm install`, `db push`,
dann erst den neuen `dist` testen und tauschen. Der noch laufende alte Server
stört sich nicht an zusätzlichen Spalten, das Zeitfenster dazwischen ist also
ungefährlich.

**Sicherer Restart-Ablauf (API):** neuen `dist/` erst nach
`~/velvet-api/server/dist_new` hochladen (nicht direkt über `dist/`
drüberkopieren), dann **manuell** testen, bevor `systemctl` angefasst wird:
`ssh u8 "cd velvet-api/server && node dist_new/src/index.js"` — ein
`EADDRINUSE`-Fehler ist normal (der alte Prozess läuft ja noch) und bestätigt
nur, dass der neue Code sauber startet. Danach tauschen, erst dann
`systemctl --user restart velvet-api`:

```bash
cd ~/velvet-api/server
[ -d dist_new ] || { echo "dist_new fehlt - nichts zu tauschen, Finger weg"; exit 1; }
mv dist dist.bak-$(date +%Y%m%d-%H%M)
mv dist_new dist
systemctl --user restart velvet-api
```

**Die Prüfung auf `dist_new` in Zeile zwei ist nicht optional.** Ohne sie
räumt ein zweiter Aufruf desselben Blocks — etwa weil man nach einer
Fehlermeldung noch einmal von vorn anfängt — den bereits getauschten,
laufenden `dist` ins Backup, findet nichts zum Zurückschieben, und der
anschließende `restart` startet den Dienst ohne Code: `MODULE_NOT_FOUND`,
API unten. Passiert am 24.08.2026 genau so. Zurück geht es dann mit
`mv dist.bak-<neuester> dist && systemctl --user restart velvet-api`.

**Der Backup-Name braucht den Zeitstempel.** Mit dem festen Namen `dist.bak`
geht das genau einmal gut: Beim zweiten Deploy existiert `dist.bak` schon, und
`mv dist dist.bak` verschiebt dann nicht *nach* `dist.bak`, sondern *hinein* —
`mv: cannot overwrite 'dist.bak/dist': Directory not empty`. Der Befehl bricht
folgenlos ab (nichts wird verschoben, die alte API läuft weiter), aber der
Deploy steht. Alte `dist.bak-*`-Verzeichnisse gelegentlich aufräumen.

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

## Welcher Stand ist gerade live?

Weil jeder der drei Web-Dienste einzeln deployed wird, können sie
unterschiedlich alt sein. Diese Checks sagen pro Endpunkt, was dort läuft —
ohne sich auf SSH oder das eigene Gedächtnis zu verlassen.

Unter Windows/PowerShell macht das ein Skript in einem Rutsch:

```powershell
.\scripts\deploy\status.ps1
```

Darunter steht, was es abfragt und wie die Antworten zu lesen sind. Die
Befehle sind in Bash-Schreibweise — in PowerShell `curl.exe` statt `curl`
schreiben (in Windows PowerShell 5.1 ist `curl` ein Alias für
`Invoke-WebRequest` und versteht diese Optionen nicht), `NUL` statt
`/dev/null`, und Schleifen als `foreach`.

**API** (`api.velvet-network.app`, systemd `velvet-api`)

```bash
curl -s https://api.velvet-network.app/health
```
`{"ok":true}` heißt nur: der Prozess läuft. Ob der *neue* Code läuft, zeigt
eine Route, die es vorher nicht gab:
```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.velvet-network.app/venue-applications
```
- `400` — Route existiert, neuer Code ist live (die 400 ist die
  Formularvalidierung, die zuschlägt, weil nichts mitgeschickt wurde; es wird
  nichts gespeichert).
- `404` — die Route kennt der Server nicht, es läuft noch der alte Stand.
- `429` — Route existiert, aber das Rate-Limit greift. Zählt als Treffer.

Der Aufruf verbraucht einen von fünf Slots pro Stunde und IP — also nicht in
einer Schleife laufen lassen.

**Dashboard und Website** (`velvet-network.app`, systemd `velvet-dashboard`)

```bash
for p in /location-anmelden /fuer-gaeste /werbematerial; do
  printf "%-20s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' https://velvet-network.app$p)"
done
```
`200` heißt: diese Seite ist deployed. `404` heißt: der Build auf dem Server
ist älter als die Seite. Neue Seiten sind damit der zuverlässigste Marker
dafür, wie alt der Dashboard-Build ist.

**Mobile-Web** (`web.velvet-network.app`, systemd `velvet-app`)

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://web.velvet-network.app/
```
Hier hilft kein Pfad-Test, weil die App eine Single-Page-Anwendung ist und
jeder Pfad `200` liefert. Den Stand sieht man nur im Browser: einloggen, auf
„Deine Locations" gehen und schauen, ob der „Ausblenden"-Knopf da ist.

**Datenbankschema**

Von außen nicht prüfbar. Auf dem Server zeigt
```bash
ssh u8 "cd velvet-api/server && npx prisma db push --schema=prisma/mysql/schema.prisma --skip-generate"
```
den Stand selbst an: Läuft es mit „already in sync" durch, ist das Schema
aktuell. Der Befehl ist bei rein additiven Änderungen ungefährlich und
idempotent — er ist damit gleichzeitig Prüfung und Reparatur.

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

**Zustimmung zu den Nutzungsbedingungen.** Das Formular hat seit dem
25.08.2026 eine Pflicht-Checkbox mit Link auf `/location-bedingungen`; ohne
Haken ist der Absende-Button aus, und `POST /venue-applications` weist die
Bewerbung zusätzlich mit `code: "LOCATION_TERMS_REQUIRED"` ab. Gespeichert
werden `acceptedTermsVersion` und `acceptedTermsAt` auf der
`VenueApplication`, angezeigt unter `/admin/applications`, und bei der
Freigabe auf die `Venue` übernommen — dort werden sie gebraucht, wenn die
Bewerbung nach sechs Monaten nur noch ein Prüfvermerk ohne Dokument ist.

Die Version wird **serverseitig** aus `TERMS_VERSION` gesetzt, nicht aus dem
Request übernommen: sonst bestimmte der Absender, welcher Fassung er
zugestimmt haben will. Anders als bei `WithdrawalConsent` wird der Wortlaut
nicht mitkopiert — das ist dort ein einzelner Satz, hier ein vollständiges
Vertragsdokument, und `TERMS_VERSION` zeigt eindeutig auf die im Repo
versionierte Fassung. Beide Felder sind nullable: Bewerbungen von vor der
Checkbox haben keine, und nachträglich abgefragt wird nichts. Bei einer
`Venue`, die wir direkt angelegt haben, bleiben sie ebenfalls leer — deren
Zustimmung steckt in einem Vertrag außerhalb der App.

Das Schema-Update ist rein additiv (neue Tabelle `VenueApplication`, später
`acceptedTermsVersion`/`acceptedTermsAt` auf `VenueApplication` und `Venue`),
also ein normaler `prisma db push` ohne `--accept-data-loss`.

## Rechtstexte und ihre Fassungen

Alle Rechtstexte stehen als `LegalSection[]` im geteilten Package, damit Dashboard
und App denselben Wortlaut zeigen:

| Text | Konstante | Seite |
| --- | --- | --- |
| Impressum | `IMPRESSUM_SECTIONS` (`legal.ts`) | `/impressum` |
| Datenschutzerklärung | `DATENSCHUTZ_SECTIONS` (`legal.ts`) | `/datenschutz` |
| Nutzungsbedingungen für Locations | `LOCATION_TERMS_SECTIONS` (`terms.ts`) | `/location-bedingungen` |
| Anlage 1, Art. 26 DSGVO | `JOINT_CONTROLLER_SECTIONS` (`terms.ts`) | dieselbe Seite, unten |
| AGB für Gäste | `GUEST_TERMS_SECTIONS` (`guest-terms.ts`) | `/agb` |
| Widerrufsbelehrung | `WIDERRUF_SECTIONS` (`guest-terms.ts`) | `/widerruf` |

Die vier neuen Texte sind **Entwürfe ohne anwaltliche Prüfung**. Gesteuert wird das
über `TERMS_DRAFT` in `packages/shared/src/terms.ts`: solange die Konstante `true`
ist, blenden alle vier Seiten (Web und App) einen Hinweisbalken ein. Nach der Prüfung
`TERMS_DRAFT` auf `false` setzen und `TERMS_VERSION` hochzählen.

`TERMS_VERSION` wird bereits gespeichert: Der Premium-Checkout legt sie zusammen mit
der Widerrufs-Zustimmung ab (siehe unten). Für die Zustimmung einer Location zu den
Nutzungsbedingungen steht dieselbe Verwendung noch aus (Roadmap-Punkt) — ohne die
Version ist später nicht nachweisbar, welcher Fassung zugestimmt wurde.

**Nach einer Textänderung `TERMS_VERSION` hochzählen**, auch im Entwurfsstadium. Die
Konstante hängt an zwei Stellen, die den Wortlaut protokollieren, und ein
unveränderter Versionsstring nach geändertem Text macht genau diesen Nachweis wertlos.

Nach jeder Textänderung `npm run build --workspace=@velvet/shared`, sonst zeigen die
Apps den alten Stand. Betrifft eine Änderung die App-Texte, wirkt sie im Web-Export
sofort, in der nativen App aber erst mit dem nächsten EAS-Build.

## Mindestalter und Widerrufs-Zustimmung

Zwei Erhebungen, die es nur wegen der Rechtslage gibt, mit demselben Muster: Es wird
nicht nur „hat zugestimmt" gespeichert, sondern das, worauf sich die Angabe bezog.

**Geburtsdatum bei der Registrierung.** `User.dateOfBirth`, gefüllt von
`POST /auth/register`. Die Prüfung steht in `packages/shared/src/age.ts`
(`checkSignupDateOfBirth`) und läuft zweimal: einmal in der App, damit ein Tippfehler
ohne Netzwerk-Roundtrip auffällt, und einmal in der API als verbindliche Instanz.
Unter 18 gibt es 400 mit `code: "UNDERAGE"`. Die Spalte ist nullable, weil Konten aus
der Zeit davor keins haben — deren AGB-Zustimmung deckte die Volljährigkeit bereits
ab, nachträglich abgefragt wird nichts. Das Geburtsdatum ist für Locations nirgends
sichtbar; es taucht in keiner Gäste-Ansicht und in keinem Scan-Ergebnis auf.

**Widerrufs-Zustimmung im Premium-Checkout.** § 356 Abs. 5 BGB lässt das
Widerrufsrecht bei einer digitalen Dienstleistung nur erlöschen, wenn ausdrücklich
dem sofortigen Beginn zugestimmt *und* die Kenntnis vom Verlust bestätigt wurde.
Beides steckt in einer Pflicht-Checkbox über den beiden Bezahl-Buttons
(`apps/mobile/app/(guest)/premium.tsx`); ohne Haken sind die Buttons deaktiviert, und
`POST /subscriptions/checkout` weist die Anfrage zusätzlich mit
`code: "WITHDRAWAL_CONSENT_REQUIRED"` ab.

Protokolliert wird in `WithdrawalConsent`: Zahlungsanbieter, Laufzeit, `TERMS_VERSION`,
die Sprachfassung **und der volle Wortlaut**, den die Person gesehen hat
(`WITHDRAWAL_CONSENT_TEXT[locale]` in `guest-terms.ts`). Der Wortlaut wird kopiert und
nicht nur referenziert — sonst würde eine spätere Textänderung rückwirkend behaupten,
jemand hätte etwas anderem zugestimmt. Angelegt wird der Datensatz **vor** der
Weiterleitung zum Zahlungsdienstleister: Die Erklärung ist mit dem Klick abgegeben,
unabhängig davon, ob der Checkout danach durchläuft. Bei einer Kontolöschung wird sie
mitgelöscht (`DELETE /users/me`).

Das Schema-Update ist rein additiv (`User.dateOfBirth`, neue Tabelle
`WithdrawalConsent`), also ein normaler `prisma db push`.

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

## Ausgesperrt: Staff-Konto per Kommandozeile anlegen

Neue Staff-Konten entstehen normalerweise im Dashboard unter *Team*. Das geht
über `POST /venues/me/staff` und setzt voraus, dass jemand als `MANAGER`
dieser Location eingeloggt ist. Geht genau dieses letzte Konto verloren, ist
der Weg zu — und `set-platform-admin` hilft nicht, weil es ein bereits
existierendes Konto braucht. Für den Fall gibt es die Hintertür:

```bash
cd ~/velvet-api/server
npm run create-staff-account -- <email> "<Name>" <venue-slug> [MANAGER|DOORMAN|SERVICE] [--admin]
```

Rolle ist ohne Angabe `MANAGER`. Ein falscher Slug beantwortet sich selbst —
das Skript listet dann alle vorhandenen auf.

Ein paar bewusste Entscheidungen dahinter:

- **Das Passwort wird erzeugt, nicht übergeben.** Ein Passwort als Argument
  landet in der Shell-History und ist in `ps` für jeden auf dem Server
  sichtbar. Es wird einmal ausgegeben und ist danach nicht mehr auslesbar
  (in der Datenbank steht nur der bcrypt-Hash). Nach dem ersten Login über
  „Passwort vergessen" ändern.
- **Es wird keine E-Mail verschickt.** Wer ausgesperrt ist, sollte sich nicht
  auch noch darauf verlassen müssen, dass SMTP gerade läuft.
- **`isDemo` wird von der Location geerbt.** Ein echter Login in einer
  Sandbox-Location (oder umgekehrt) könnte niemanden scannen — siehe
  „Test-Zugänge" weiter unten.
- **`--admin` wird an einer Sandbox-Location abgelehnt.** `isPlatformAdmin`
  kennt keine Welten: `requirePlatformAdmin` prüft nur das Flag. Ein
  Sandbox-Konto mit `--admin` könnte also echte Location-Bewerbungen
  freigeben und echte Gewerbeanmeldungen herunterladen.

## Location löschen

Eine Location, die nie in Betrieb war — Tippfehler, abgebrochene Bewerbung,
Testeintrag — lässt sich entfernen:

```bash
cd ~/velvet-api/server
npm run delete-venue -- <slug>                          # Trockenlauf
npm run delete-venue -- <slug> --confirm
npm run delete-venue -- <slug> --confirm --with-staff
```

Ohne `--confirm` wird nur gezeigt, was passieren würde. Mitgelöscht werden die
Team-Zuordnungen und die Gast-Verknüpfungen (Historie/ausgeblendet) dieser
Location.

**Das Skript verweigert, sobald Scans oder Bewertungen daran hängen.** Die
gehören zur Historie der betroffenen Gäste und fließen in deren
Vertrauenswert ein; sie zu löschen würde den rückwirkend verändern. Für diesen
Fall bleibt vorerst nur `npm run set-demo -- venue <slug>` — mit dem
Nebeneffekt, dass auch die berechtigten Bewertungen dieser Location entwertet
werden. Ein eigener Zustand `SUSPENDED` steht in `docs/roadmap.md`.

`--with-staff` räumt Staff-Konten mit weg, die danach an keiner Location mehr
hängen. Solche Konten sind sonst tote Karteileichen: Der Login antwortet mit
403 (`auth.staffNoVenue`), die E-Mail-Adresse bleibt aber blockiert, weil
`StaffAccount.email` unique ist. Gelöscht werden dabei nur Konten **ohne
eigene Spuren** — wer Bewertungen, Scans oder Nachrichten hinterlassen hat,
bleibt bestehen und wird im Trockenlauf einzeln benannt.

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

## Ausgeblendete Locations

Gäste können eine Location aus ihrer eigenen Historie nehmen — ein
Fetischclub, eine queere Bar, was auch immer man nicht auf einem Handy
gelistet haben möchte, das jemand anders in die Hand nimmt. Die Logik steht in
`server/src/lib/hidden-venues.ts`.

**Was Ausblenden nicht tut, ist so wichtig wie was es tut.** Die Bewertungen
von dort zählen weiter für den Trust-Score, und die Location behält ihre
eigenen Aufzeichnungen (Besuche, Flags, interne Notizen). Sonst wäre das ein
Knopf zum Löschen eines schlechten Abends, und die Grundlage eines geteilten
Vertrauensnetzwerks wäre weg. Es ist eine Kontrolle darüber, wer die
Verbindung sieht — nicht darüber, was passiert ist.

Konkret verschwindet die Location aus:

- der eigenen Historie in der Gast-App (`GET /users/me/venues`),
- dem Premium-Matching, **in beide Richtungen** — sonst wäre das Ausblenden
  wirkungslos, weil der Chat selbst weiterhin verkünden würde, dass beide dort
  waren.

Eine Ausnahme beim Matching: Ein **bereits bestehender** Chat bleibt offen. Die
andere Person hat einen längst gesehen, bevor die Location ausgeblendet wurde
— den Verlauf jetzt zu kappen schützt nichts und hinterlässt nur einen Chat,
der stillschweigend nicht mehr funktioniert. Wer da raus will, blockiert.

### Rückgängig machen (nur Support)

In der App gibt es bewusst **kein** Wiedereinblenden. Ein Umschalter würde
genau das Gegenteil bewirken: Wer ein entsperrtes Handy in der Hand hält,
könnte die versteckten Locations wieder sichtbar machen — und die Liste der
Ausgeblendeten wäre selbst das Interessanteste am Screen. Zurückholen geht
deshalb nur hier, nachdem die Person darum gebeten hat:

```bash
npm run unhide-venue -- <gast-email>              # zeigt, was ausgeblendet ist
npm run unhide-venue -- <gast-email> <venue-slug> # holt eine zurück
```

Das Schema-Update ist rein additiv (`VenueRelationship.hiddenAt`), also ein
normaler `prisma db push`.

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

### Bestehendes Staff-Konto in die Sandbox holen

Ein Staff-Account arbeitet in der Welt der Location, der er angehört — das
`isDemo`-Flag am Konto allein nützt also nichts, solange er Mitglied einer
echten Location ist. Die **Mitgliedschaft muss umziehen**, und das kann die
Oberfläche nicht: Die Team-Maske legt immer ein *neues* Konto an und lehnt
eine bereits vergebene E-Mail mit 409 ab.

Dafür gibt es `sandbox-staff`. Genau der Fall der Store-Reviewer, deren
Zugangsdaten bei Google und Apple hinterlegt sind und deshalb erhalten bleiben
müssen:

```bash
npm run set-demo -- venue <sandbox-slug>                        # zuerst
npm run sandbox-staff -- staff-review@feif.space <sandbox-slug> # Trockenlauf
npm run sandbox-staff -- staff-review@feif.space <sandbox-slug> --confirm
```

Ohne `--confirm` zeigt es nur, was es täte. Es entfernt alle Mitgliedschaften
an anderen Locations, legt eine an der Sandbox an (Standardrolle `MANAGER`,
optional `DOORMAN`/`SERVICE` als drittes Argument) und setzt `isDemo`. Ist die
Ziel-Location keine Sandbox, bricht es ab — sonst würde es das Gegenteil des
Gewollten tun.

**Vorher prüfen, wen die Umstellung im Score trifft.** Das Flag wirkt
rückwirkend: Alle Bewertungen, die das Konto je an echten Gästen vergeben hat,
zählen ab sofort nicht mehr, und deren Stufe kann sich ändern. Das ist der
Sinn der Sache, sollte einen aber nicht überraschen:

```bash
mysql velvet -e "
SELECT u.email, COUNT(*) AS bewertungen
FROM Rating r
JOIN StaffAccount s ON s.id = r.staffAccountId
JOIN User u ON u.id = r.userId
WHERE s.email = 'staff-review@feif.space'
GROUP BY u.email;"
```

Der Gast-Reviewer (`playstore-review@feif.space`) hat keine Mitgliedschaft und
braucht deshalb nur `npm run set-demo -- user <email>`. Seine bisherigen
Besuche an echten Locations bleiben in der Datenbank, sind für ihn aber nicht
mehr sichtbar — die App startet für ihn faktisch leer.

Ausgestellte Tokens leben weiter: Wer gerade eingeloggt ist, behält seine alte
Location bis zum nächsten Login. Einmal ab- und wieder anmelden lassen.

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
