<#
.SYNOPSIS
    Baut und deployed apps/dashboard auf Uberspace (velvet-dashboard).

.DESCRIPTION
    Automatisiert den manuellen Dashboard-Deploy-Ablauf aus docs/deployment.md:
    .env.local wegschieben, mit korrekter NEXT_PUBLIC_API_URL bauen,
    verifizieren, .next (ohne cache) + app/components/public/lib hochladen,
    Service neu starten, .env.local zurückholen. Läuft lokal (Windows/
    PowerShell) -- baut niemals auf dem Uberspace-Server selbst (RAM-Limit,
    siehe CLAUDE.md).

.EXAMPLE
    .\scripts\deploy\dashboard.ps1
#>

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$DashboardDir = Join-Path $RepoRoot "apps\dashboard"
$ApiUrl = "https://api.velvet-network.app"
$RemoteHost = "u8"
$RemoteDir = "~/velvet-dashboard/apps/dashboard/"
$SharedDir = Join-Path $RepoRoot "packages\shared"
$RemoteSharedDir = "~/velvet-dashboard/packages/shared/"

# @velvet/shared wird als kompiliertes Paket konsumiert, nicht als Quelltext.
# Ohne diesen Schritt baut das Dashboard gegen ein womoeglich veraltetes dist,
# und der Fehler faellt nirgends auf -- er wird einfach mitgebacken.
Write-Host "-- Baue @velvet/shared"
Push-Location $RepoRoot
try {
    npm run build --workspace=@velvet/shared
    if ($LASTEXITCODE -ne 0) { throw "Build von @velvet/shared fehlgeschlagen (Exit $LASTEXITCODE)" }
}
finally { Pop-Location }

Push-Location $DashboardDir
try {
    # Ein abgebrochener Lauf (Strg-C, Timeout) kommt nie bis zum finally-Block
    # und laesst .env.local.bak liegen. Ohne diese Zeilen sieht der naechste
    # Lauf gar keine .env.local, schiebt nichts weg, stellt am Ende nichts
    # wieder her -- und die Datei bleibt dauerhaft verschwunden, was erst beim
    # naechsten lokalen Entwickeln auffaellt.
    if ((-not (Test-Path ".env.local")) -and (Test-Path ".env.local.bak")) {
        Move-Item ".env.local.bak" ".env.local" -Force
        Write-Host "-- .env.local.bak aus einem abgebrochenen Lauf zurueckgeholt"
    }

    $envLocalBackedUp = $false
    if (Test-Path ".env.local") {
        Move-Item ".env.local" ".env.local.bak" -Force
        $envLocalBackedUp = $true
        Write-Host "-- .env.local vorübergehend weggeschoben"
    }

    Write-Host "-- Baue Dashboard mit NEXT_PUBLIC_API_URL=$ApiUrl"
    $env:NEXT_PUBLIC_API_URL = $ApiUrl
    npx next build
    if ($LASTEXITCODE -ne 0) { throw "next build fehlgeschlagen (Exit $LASTEXITCODE)" }

    Write-Host "-- Verifiziere eingebackene API-URL"
    $hit = Select-String -Path ".next\static\chunks\*.js" -Pattern ([regex]::Escape($ApiUrl)) -List
    if (-not $hit) {
        throw "API-URL '$ApiUrl' taucht in keinem gebauten Chunk auf -- Build NICHT hochladen. " +
              "Häufigste Ursache: .env.local hat .env.production überschrieben."
    }
    Write-Host "   gefunden in: $($hit.Path)"

    Write-Host "-- Staging ohne .next/cache"
    $stageDir = Join-Path $env:TEMP "velvet-dashboard-deploy"
    if (Test-Path $stageDir) { Remove-Item $stageDir -Recurse -Force }
    New-Item -ItemType Directory -Path $stageDir | Out-Null
    robocopy ".next" (Join-Path $stageDir ".next") /E /XD cache /NFL /NDL /NJH | Out-Null
    if ($LASTEXITCODE -ge 8) { throw "robocopy von .next fehlgeschlagen (Exit $LASTEXITCODE)" }
    foreach ($dir in @("app", "components", "public", "lib")) {
        robocopy $dir (Join-Path $stageDir $dir) /E /NFL /NDL /NJH | Out-Null
        if ($LASTEXITCODE -ge 8) { throw "robocopy von $dir fehlgeschlagen (Exit $LASTEXITCODE)" }
    }

    Write-Host "-- Entsperre Zielverzeichnisse (sind zwischen Deploys rekursiv 500/700-geschuetzt)"
    ssh $RemoteHost "chmod -R u+w ${RemoteDir}.next ${RemoteDir}app ${RemoteDir}components ${RemoteDir}lib ${RemoteDir}public 2>/dev/null; true"

    Write-Host "-- Lade nach $RemoteHost hoch"
    # Einzeln statt in einem scp-Aufruf -- ein Klammer-Routengruppen-Ordner wie
    # app/(app)/ bringt scp bei mehreren Quellen in einem Aufruf durcheinander
    # ("stat remote: No such file or directory").
    foreach ($dir in @(".next", "app", "components", "public", "lib")) {
        scp -r "$stageDir\$dir" "${RemoteHost}:${RemoteDir}"
        if ($LASTEXITCODE -ne 0) { throw "scp von $dir fehlgeschlagen (Exit $LASTEXITCODE)" }
    }

    # Der Server haelt eine eigene shared-Kopie fuer alles, was zur Laufzeit
    # rendert. Vorgerenderte Seiten wie /impressum sehen korrekt aus, waehrend
    # diese Kopie tagelang hinterherhaengt -- genau so lag die geloeschte
    # Steuernummer am 26.08.2026 noch auf der Platte, obwohl die Seite sauber
    # war. Verzeichnisform wie oben, nicht dist/* -- PowerShell expandiert
    # Wildcards fuer native Befehle nicht.
    Write-Host "-- Lade @velvet/shared hoch"
    ssh $RemoteHost "chmod -R u+w $RemoteSharedDir 2>/dev/null; mkdir -p $RemoteSharedDir; true"
    scp -r "$SharedDir\dist" "${RemoteHost}:${RemoteSharedDir}"
    if ($LASTEXITCODE -ne 0) { throw "scp von shared/dist fehlgeschlagen (Exit $LASTEXITCODE)" }
    scp "$SharedDir\package.json" "${RemoteHost}:${RemoteSharedDir}"
    if ($LASTEXITCODE -ne 0) { throw "scp von shared/package.json fehlgeschlagen (Exit $LASTEXITCODE)" }

    Write-Host "-- Sperre Zielverzeichnisse wieder"
    ssh $RemoteHost "chmod -R 500 ${RemoteDir}app ${RemoteDir}components ${RemoteDir}lib ${RemoteDir}public && chmod -R 700 ${RemoteDir}.next"

    Write-Host "-- Starte velvet-dashboard neu"
    ssh $RemoteHost "systemctl --user restart velvet-dashboard"
    if ($LASTEXITCODE -ne 0) { throw "Restart über ssh fehlgeschlagen (Exit $LASTEXITCODE)" }

    Remove-Item $stageDir -Recurse -Force
    Write-Host "-- Fertig. https://velvet-network.app prüfen."
}
finally {
    Remove-Item Env:\NEXT_PUBLIC_API_URL -ErrorAction SilentlyContinue
    if ($envLocalBackedUp -and (Test-Path ".env.local.bak")) {
        Move-Item ".env.local.bak" ".env.local" -Force
        Write-Host "-- .env.local wiederhergestellt"
    }
    Pop-Location
}
