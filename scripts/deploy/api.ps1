<#
.SYNOPSIS
    Baut und deployed server/ auf Uberspace (velvet-api).

.DESCRIPTION
    Automatisiert den bis dahin von Hand ausgefuehrten API-Deploy aus
    docs/deployment.md. Bildet dessen Reihenfolge und Absicherungen ab:
    shared und server lokal bauen, Zielverzeichnisse entsperren, hochladen,
    npm install, prisma generate, db push, den neuen dist erst starten und
    dann erst tauschen, Restart, Health-Check.

    Laeuft lokal (Windows/PowerShell) -- baut niemals auf dem Uberspace-Server
    selbst (RAM-Limit, siehe CLAUDE.md).

.EXAMPLE
    .\scripts\deploy\api.ps1
#>

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$ServerDir = Join-Path $RepoRoot "server"
$SharedDir = Join-Path $RepoRoot "packages\shared"
$RemoteHost = "u8"
$RemoteRoot = "~/velvet-api"

# `scp -r <verzeichnis> ziel/` kopiert bei bereits existierendem Ziel *hinein*
# statt zu ersetzen -- aus server/scripts wird beim zweiten Lauf
# server/scripts/scripts, und jedes `npm run <skript>` scheitert danach mit
# ERR_MODULE_NOT_FOUND, obwohl der Upload fehlerfrei durchlief. Die robuste
# Form aus docs/deployment.md kopiert den *Inhalt*. PowerShell expandiert
# Wildcards fuer native Befehle nicht, deshalb wird hier selbst aufgezaehlt.
function Copy-DirContents {
    param([string]$LocalDir, [string]$RemoteDir)

    ssh $RemoteHost "mkdir -p $RemoteDir"
    if ($LASTEXITCODE -ne 0) { throw "mkdir $RemoteDir fehlgeschlagen (Exit $LASTEXITCODE)" }

    $items = @(Get-ChildItem -Force $LocalDir | ForEach-Object { $_.FullName })
    if ($items.Count -eq 0) { throw "$LocalDir ist leer -- nichts hochzuladen" }

    scp -r @items "${RemoteHost}:${RemoteDir}/"
    if ($LASTEXITCODE -ne 0) { throw "scp von $LocalDir fehlgeschlagen (Exit $LASTEXITCODE)" }
}

Write-Host "-- Baue @velvet/shared"
Push-Location $RepoRoot
try {
    npm run build --workspace=@velvet/shared
    if ($LASTEXITCODE -ne 0) { throw "Build von @velvet/shared fehlgeschlagen (Exit $LASTEXITCODE)" }
}
finally { Pop-Location }

Write-Host "-- Baue server/"
Push-Location $ServerDir
try {
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build von server/ fehlgeschlagen (Exit $LASTEXITCODE)" }
}
finally { Pop-Location }

if (-not (Test-Path (Join-Path $ServerDir "dist\src\index.js"))) {
    throw "server/dist/src/index.js fehlt nach dem Build -- Abbruch vor dem Upload"
}

# ~/velvet-api/server/{src,prisma,dist} liegen zwischen Deploys als dr-x------
# bzw. drwx------. Ohne das hier scheitert der Upload nicht beim Schreiben,
# sondern beim Aufraeumen davor: "rm: cannot remove ...: Permission denied",
# zeilenweise fuer jede Datei -- im eigenen Home-Verzeichnis, was zunaechst
# nach einem kaputten Account aussieht.
Write-Host "-- Entsperre Zielverzeichnisse"
ssh $RemoteHost "chmod -R u+w $RemoteRoot"
if ($LASTEXITCODE -ne 0) { throw "chmod fehlgeschlagen (Exit $LASTEXITCODE)" }

Write-Host "-- Lade hoch"
scp (Join-Path $RepoRoot "package.json") (Join-Path $RepoRoot "package-lock.json") "${RemoteHost}:${RemoteRoot}/"
if ($LASTEXITCODE -ne 0) { throw "scp der Root-Manifeste fehlgeschlagen (Exit $LASTEXITCODE)" }

scp (Join-Path $SharedDir "package.json") "${RemoteHost}:${RemoteRoot}/packages/shared/"
if ($LASTEXITCODE -ne 0) { throw "scp von shared/package.json fehlgeschlagen (Exit $LASTEXITCODE)" }
Copy-DirContents (Join-Path $SharedDir "dist") "$RemoteRoot/packages/shared/dist"

scp (Join-Path $ServerDir "package.json") "${RemoteHost}:${RemoteRoot}/server/"
if ($LASTEXITCODE -ne 0) { throw "scp von server/package.json fehlgeschlagen (Exit $LASTEXITCODE)" }

# scripts/ gehoert ausdruecklich dazu: die tsx-basierten Einmal-Skripte liegen
# dort, nicht in src/. Fehlen sie, scheitert jedes `npm run <skript>` auf dem
# Server, obwohl die API selbst tadellos laeuft. src/ wird zusaetzlich
# gebraucht, weil die Skripte von dort importieren.
foreach ($dir in @("src", "scripts", "prisma")) {
    Copy-DirContents (Join-Path $ServerDir $dir) "$RemoteRoot/server/$dir"
}

# dist NIE direkt ueberschreiben -- erst daneben legen, testen, dann tauschen.
Write-Host "-- Lade neuen dist nach dist_new"
ssh $RemoteHost "rm -rf $RemoteRoot/server/dist_new"
if ($LASTEXITCODE -ne 0) { throw "Aufraeumen von dist_new fehlgeschlagen (Exit $LASTEXITCODE)" }
Copy-DirContents (Join-Path $ServerDir "dist") "$RemoteRoot/server/dist_new"

# Reihenfolge ist wichtig: `prisma db push` liest das Schema, das auf dem
# Server liegt. Vor dem Upload ausgefuehrt pusht es das alte und meldet
# "already in sync", ohne etwas zu tun. Der noch laufende alte Server stoert
# sich nicht an zusaetzlichen Spalten, das Fenster dazwischen ist ungefaehrlich.
Write-Host "-- npm install und Prisma auf dem Server"
$install = @"
set -e
cd $RemoteRoot
npm install 2>&1 | tee /tmp/velvet-npm-install.log
if grep -q 'install-scripts' /tmp/velvet-npm-install.log; then
  echo 'BLOCKIERTE-POSTINSTALL-SKRIPTE'
fi
cd server
npx prisma generate --schema=prisma/mysql/schema.prisma
npx prisma db push --schema=prisma/mysql/schema.prisma --skip-generate
"@
# CRLF wuerde hier jede Zeile mit einem \r beenden: aus `set -e` wird
# `set -e\r` ("invalid option", errexit bleibt AUS). Siehe den 404-Vorfall in
# docs/deployment.md, den genau das ausgeloest hat.
$installOutput = ssh $RemoteHost ($install -replace "`r`n", "`n") 2>&1 | Out-String
Write-Host $installOutput
if ($LASTEXITCODE -ne 0) { throw "npm install / prisma auf dem Server fehlgeschlagen (Exit $LASTEXITCODE)" }
if ($installOutput -match "BLOCKIERTE-POSTINSTALL-SKRIPTE") {
    throw "npm hat Postinstall-Skripte blockiert (npm warn install-scripts). " +
          "Betrifft meist @prisma/client, @prisma/engines, prisma, esbuild. " +
          "Auf dem Server 'npm install-scripts approve <pkg>' fuer jedes Paket " +
          "ausfuehren, dann 'npm install' erneut -- sonst schlagen prisma/tsx " +
          "spaeter mit verwirrenden Fehlern fehl. Getauscht wurde noch nichts."
}

# Der neue Code muss starten, bevor systemctl angefasst wird. EADDRINUSE ist
# dabei das *erwuenschte* Ergebnis: der alte Prozess haelt den Port noch, der
# Fehler beweist also, dass der neue Code bis zum Listen-Aufruf sauber
# hochgekommen ist. Ein anderer Fehler (etwa MODULE_NOT_FOUND) bedeutet
# Abbruch, ohne irgendetwas zu tauschen.
Write-Host "-- Teste neuen dist, ohne zu tauschen"
$smoke = @"
cd $RemoteRoot/server
timeout 25 node dist_new/src/index.js 2>&1 | head -40
"@
$smokeOutput = ssh $RemoteHost ($smoke -replace "`r`n", "`n") 2>&1 | Out-String
Write-Host $smokeOutput
if ($smokeOutput -notmatch "EADDRINUSE") {
    throw "Der neue dist hat nicht mit EADDRINUSE quittiert. Entweder laeuft die " +
          "alte API nicht mehr, oder der neue Code startet nicht. Ausgabe oben " +
          "pruefen. Es wurde nichts getauscht, die laufende API ist unberuehrt."
}

# Die Pruefung auf dist_new ist nicht optional: ohne sie raeumt ein zweiter
# Aufruf den bereits getauschten, laufenden dist ins Backup, findet nichts zum
# Zurueckschieben, und der Restart startet den Dienst ohne Code
# (MODULE_NOT_FOUND, API unten). Genau so passiert am 24.08.2026.
# Der Zeitstempel im Backup-Namen ist ebenfalls Pflicht: mit festem Namen
# `dist.bak` verschiebt `mv` beim zweiten Deploy nicht *nach*, sondern *hinein*.
Write-Host "-- Tausche dist und starte velvet-api neu"
$swap = @"
set -e
cd $RemoteRoot/server
[ -d dist_new ] || { echo 'dist_new fehlt - nichts zu tauschen'; exit 1; }
mv dist dist.bak-`$(date +%Y%m%d-%H%M)
mv dist_new dist
systemctl --user restart velvet-api
"@
ssh $RemoteHost ($swap -replace "`r`n", "`n")
if ($LASTEXITCODE -ne 0) { throw "Tausch/Restart fehlgeschlagen (Exit $LASTEXITCODE)" }

Write-Host "-- Pruefe, was live ist"
Start-Sleep -Seconds 3
$health = Invoke-WebRequest -Uri "https://api.velvet-network.app/health" -SkipHttpErrorCheck
Write-Host "   /health -> $($health.StatusCode) $($health.Content)"
if ($health.StatusCode -ne 200) {
    throw "api.velvet-network.app/health antwortet mit $($health.StatusCode). " +
          "Zurueck geht es mit: ssh $RemoteHost `"cd $RemoteRoot/server && " +
          "mv dist.bak-<neuester> dist && systemctl --user restart velvet-api`""
}

Write-Host "-- Fertig."
Write-Host "   Alte dist.bak-* liegen auf dem Server und werden nicht automatisch"
Write-Host "   geloescht -- sie sind das Rueckfallnetz. Gelegentlich aufraeumen."
