<#
.SYNOPSIS
    Pusht master und deployed genau die Ziele, die sich dadurch geaendert haben.

.DESCRIPTION
    Der lokale Ersatz fuer CI/CD. Gebaut wird auf diesem Rechner -- der
    Uberspace-Server hat zu wenig RAM, und ein Runner *auf* ihm wurde am
    24.08.2026 versucht und wieder verworfen (siehe CLAUDE.md).

    Reihenfolge ist bewusst: erst pushen, dann deployen. Git kennt keinen
    post-push-Hook, und ein pre-push-Hook waere die falsche Richtung -- ein
    gescheiterter Deploy wuerde dann den Push blockieren, mit dem man den Fix
    nachreichen will.

    Welche Skripte laufen, ergibt sich aus den gepushten Dateien:
      server/**, package.json, package-lock.json  -> api.ps1
      apps/dashboard/**                           -> dashboard.ps1
      apps/mobile/**                              -> app.ps1
      packages/shared/**                          -> alle drei
      docs/**, scripts/**, CLAUDE.md              -> keines

.PARAMETER DryRun
    Zeigt nur, was gepusht und deployed wuerde. Aendert nichts.

.PARAMETER Redeploy
    Deployed auch dann, wenn es nichts zu pushen gibt -- gedacht fuer den Fall,
    dass ein frueherer Deploy abgebrochen ist. Vergleicht dann die letzten
    Commits gegen den Stand, der zuletzt gepusht wurde.

.EXAMPLE
    .\scripts\deploy\ship.ps1 -DryRun
    .\scripts\deploy\ship.ps1
#>

param(
    [switch]$DryRun,
    [switch]$Redeploy
)

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$ScriptDir = $PSScriptRoot

Push-Location $RepoRoot
try {
    $branch = (git rev-parse --abbrev-ref HEAD).Trim()
    if ($branch -ne "master") {
        throw "Aktueller Branch ist '$branch', nicht master. ship.ps1 deployed nur master."
    }

    # Ein unsauberer Baum heisst: es liegt Arbeit herum, die nicht im Push ist.
    # Die wuerde live gehen, ohne je committet worden zu sein -- oder eben
    # nicht, und dann stimmt die Annahme nicht mehr, dass live == master ist.
    $dirty = (git status --porcelain)
    if ($dirty) {
        Write-Host "-- Nicht committete Aenderungen:"
        Write-Host $dirty
        throw "Arbeitsverzeichnis ist nicht sauber. Erst committen, dann shippen."
    }

    git fetch origin master --quiet
    if ($LASTEXITCODE -ne 0) { throw "git fetch fehlgeschlagen (Exit $LASTEXITCODE)" }

    $before = (git rev-parse origin/master).Trim()
    $head = (git rev-parse HEAD).Trim()

    if ($before -eq $head -and -not $Redeploy) {
        Write-Host "-- origin/master ist bereits auf $($head.Substring(0,7)) -- nichts zu pushen."
        Write-Host "   Fuer einen erneuten Deploy ohne neue Commits: ship.ps1 -Redeploy"
        return
    }

    # Bei -Redeploy ohne neue Commits gibt es kein Intervall, das etwas
    # aussagt -- dann alles deployen statt stillschweigend nichts zu tun.
    if ($before -eq $head) {
        Write-Host "-- Keine neuen Commits, -Redeploy gesetzt: alle drei Ziele"
        $changed = @("server/", "apps/dashboard/", "apps/mobile/")
    } else {
        $changed = @(git diff --name-only "$before..$head")
        if ($LASTEXITCODE -ne 0) { throw "git diff fehlgeschlagen (Exit $LASTEXITCODE)" }
    }

    $sharedTouched = @($changed | Where-Object { $_ -like "packages/shared/*" }).Count -gt 0

    $needApi = $sharedTouched -or @($changed | Where-Object {
        $_ -like "server/*" -or $_ -eq "package.json" -or $_ -eq "package-lock.json"
    }).Count -gt 0

    $needDashboard = $sharedTouched -or @($changed | Where-Object { $_ -like "apps/dashboard/*" }).Count -gt 0
    $needApp = $sharedTouched -or @($changed | Where-Object { $_ -like "apps/mobile/*" }).Count -gt 0

    Write-Host ""
    Write-Host "-- Commits: $($before.Substring(0,7)) -> $($head.Substring(0,7))  ($($changed.Count) Dateien)"
    if ($sharedTouched) { Write-Host "   packages/shared beruehrt -- betrifft alle drei Ziele" }
    Write-Host "   API        : $(if ($needApi) { 'ja' } else { 'nein' })"
    Write-Host "   Dashboard  : $(if ($needDashboard) { 'ja' } else { 'nein' })"
    Write-Host "   Gast-App   : $(if ($needApp) { 'ja' } else { 'nein' })"
    Write-Host ""

    if (-not ($needApi -or $needDashboard -or $needApp)) {
        Write-Host "-- Kein Ziel betroffen (nur Doku/Skripte?). Es wird nur gepusht."
    }

    if ($DryRun) {
        Write-Host "-- DryRun: es wurde nichts gepusht und nichts deployed."
        return
    }

    if ($before -ne $head) {
        Write-Host "-- Pushe nach origin/master"
        git push origin master
        if ($LASTEXITCODE -ne 0) { throw "git push fehlgeschlagen (Exit $LASTEXITCODE)" }
    }

    # Ab hier ist der Push durch. Ein Fehler weiter unten bedeutet: master ist
    # weiter als die Produktion. Das wird am Ende ausdruecklich gesagt, statt
    # es in einem Stacktrace untergehen zu lassen.
    $done = @()
    $failed = @()

    $targets = @(
        @{ Name = "API";       Run = $needApi;       Script = "api.ps1" }
        @{ Name = "Dashboard"; Run = $needDashboard; Script = "dashboard.ps1" }
        @{ Name = "Gast-App";  Run = $needApp;       Script = "app.ps1" }
    )

    foreach ($t in $targets) {
        if (-not $t.Run) { continue }
        Write-Host ""
        Write-Host "=== $($t.Name): $($t.Script) ==="
        try {
            & (Join-Path $ScriptDir $t.Script)
            $done += $t.Name
        }
        catch {
            $failed += "$($t.Name) ($($_.Exception.Message))"
            # Nicht abbrechen: ein gescheitertes Ziel ist kein Grund, die
            # anderen ungedeployed zu lassen -- sie haengen nicht voneinander ab.
            Write-Host "!! $($t.Name) fehlgeschlagen: $($_.Exception.Message)"
        }
    }

    Write-Host ""
    Write-Host "=== Ergebnis ==="
    Write-Host "   gepusht    : $($head.Substring(0,7))"
    if ($done.Count)   { Write-Host "   deployed   : $($done -join ', ')" }
    if ($failed.Count) {
        Write-Host "   FEHLER     : $($failed -join ' | ')"
        throw "master ist gepusht, aber nicht alles ist live. Betroffene Ziele oben."
    }
    Write-Host "   Alles live."
}
finally {
    Pop-Location
}
