<#
.SYNOPSIS
    Baut den Mobile-Web-Export und deployed ihn auf Uberspace (velvet-app).

.DESCRIPTION
    Automatisiert Punkt 3 des Deploy-Ablaufs aus docs/deployment.md:
    .env wegschieben (zeigt auf localhost und würde die Prod-URL verdrängen),
    mit --clear exportieren, die eingebackene API-URL verifizieren, das
    Ergebnis als tar hochladen und auf dem Server in einem Rutsch gegen das
    laufende Verzeichnis tauschen. Läuft lokal (Windows/PowerShell) -- baut
    niemals auf dem Uberspace-Server selbst (RAM-Limit, siehe CLAUDE.md).

.EXAMPLE
    .\scripts\deploy\app.ps1
#>

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$MobileDir = Join-Path $RepoRoot "apps\mobile"
$ApiUrl = "https://api.velvet-network.app"
$RemoteHost = "u8"
$RemoteDir = "~/html/velvet-app"
$RemoteTarball = "~/velvet-app-dist.tgz"

Push-Location $MobileDir
try {
    # apps/mobile/.env zeigt auf http://localhost:4000. Ob eine bereits
    # gesetzte Prozessvariable gewinnt, hängt an der dotenv-Reihenfolge --
    # darauf zu wetten hat schon einmal einen Build mit localhost-URL
    # produziert. Wegschieben ist die eindeutige Variante.
    $envBackedUp = $false
    if (Test-Path ".env") {
        Move-Item ".env" ".env.bak" -Force
        $envBackedUp = $true
        Write-Host "-- .env vorübergehend weggeschoben"
    }

    Write-Host "-- Exportiere Mobile-Web mit EXPO_PUBLIC_API_URL=$ApiUrl"
    $env:EXPO_PUBLIC_API_URL = $ApiUrl
    # --clear ist Pflicht: Metros Transform-Cache ist nicht nach dem
    # EXPO_PUBLIC_*-Wert geschlüsselt, ohne ihn wird stillschweigend ein altes
    # Bundle mit einer früheren URL wiederverwendet.
    npx expo export --platform web --clear
    if ($LASTEXITCODE -ne 0) { throw "expo export fehlgeschlagen (Exit $LASTEXITCODE)" }

    Write-Host "-- Verifiziere eingebackene API-URL"
    $bundles = Get-ChildItem "dist\_expo\static\js\web\*.js"
    if (-not $bundles) { throw "Kein Web-Bundle in dist/_expo/static/js/web -- Export unvollständig." }
    if (Select-String -Path $bundles -Pattern "localhost:4000" -List) {
        throw "Das Bundle enthält localhost:4000 -- NICHT hochladen. Ursache: .env hat die Prod-URL verdrängt."
    }
    if (-not (Select-String -Path $bundles -Pattern ([regex]::Escape("api.velvet-network.app")) -List)) {
        throw "'api.velvet-network.app' taucht in keinem Bundle auf -- Export NICHT hochladen."
    }
    Write-Host "   ok, nur die Produktions-URL ist eingebacken"

    # Die beiden Universal-Links-Dateien kommen aus apps/mobile/public/ und
    # liegen im Zielverzeichnis unter .well-known/. Fehlen sie im Export,
    # würde der Verzeichnistausch unten sie auf dem Server entfernen und
    # iOS/Android könnten die Domain nicht mehr verifizieren.
    foreach ($f in @("dist\.well-known\apple-app-site-association", "dist\.well-known\assetlinks.json")) {
        if (-not (Test-Path $f)) { throw "$f fehlt im Export -- Upload würde die Universal Links zerstören." }
    }
    Write-Host "-- .well-known/ ist im Export enthalten"

    Write-Host "-- Packe dist/"
    $tarball = Join-Path $env:TEMP "velvet-app-dist.tgz"
    if (Test-Path $tarball) { Remove-Item $tarball -Force }
    tar czf $tarball -C dist .
    if ($LASTEXITCODE -ne 0) { throw "tar fehlgeschlagen (Exit $LASTEXITCODE)" }

    Write-Host "-- Lade nach $RemoteHost hoch"
    scp $tarball "${RemoteHost}:${RemoteTarball}"
    if ($LASTEXITCODE -ne 0) { throw "scp fehlgeschlagen (Exit $LASTEXITCODE)" }

    # Erst vollständig daneben entpacken, dann tauschen: ein "Zielordner leeren
    # und neu befüllen" liefert währenddessen einen halben Stand aus -- und ein
    # `rm -rf .../*` würde .well-known/ gar nicht erst erwischen, weil der Glob
    # keine Dotverzeichnisse trifft.
    Write-Host "-- Tausche Verzeichnis und starte velvet-app neu"
    $remoteScript = @"
set -e
rm -rf $RemoteDir.new $RemoteDir.old
mkdir -p $RemoteDir.new
tar xzf $RemoteTarball -C $RemoteDir.new
mv $RemoteDir $RemoteDir.old
mv $RemoteDir.new $RemoteDir
rm -rf $RemoteDir.old $RemoteTarball
systemctl --user restart velvet-app
"@
    ssh $RemoteHost $remoteScript
    if ($LASTEXITCODE -ne 0) { throw "Deploy über ssh fehlgeschlagen (Exit $LASTEXITCODE)" }

    Write-Host "-- Prüfe, was live ist"
    $status = (Invoke-WebRequest -Uri "https://web.velvet-network.app/" -Method Head -SkipHttpErrorCheck).StatusCode
    Write-Host "   web.velvet-network.app -> $status"
    $aasa = Invoke-WebRequest -Uri "https://web.velvet-network.app/.well-known/apple-app-site-association" -SkipHttpErrorCheck
    Write-Host "   apple-app-site-association -> $($aasa.StatusCode) $($aasa.Headers['Content-Type'])"
    if ($status -ne 200) { throw "web.velvet-network.app antwortet mit $status" }
    if ($aasa.StatusCode -ne 200) { throw "apple-app-site-association antwortet mit $($aasa.StatusCode)" }

    Remove-Item $tarball -Force
    Write-Host "-- Fertig."
}
finally {
    Remove-Item Env:\EXPO_PUBLIC_API_URL -ErrorAction SilentlyContinue
    if ($envBackedUp -and (Test-Path ".env.bak")) {
        Move-Item ".env.bak" ".env" -Force
        Write-Host "-- .env wiederhergestellt"
    }
    Pop-Location
}
