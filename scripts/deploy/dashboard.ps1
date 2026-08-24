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

Push-Location $DashboardDir
try {
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

    Write-Host "-- Lade nach $RemoteHost hoch"
    scp -r "$stageDir\.next" "$stageDir\app" "$stageDir\components" "$stageDir\public" "$stageDir\lib" "${RemoteHost}:${RemoteDir}"
    if ($LASTEXITCODE -ne 0) { throw "scp fehlgeschlagen (Exit $LASTEXITCODE)" }

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
