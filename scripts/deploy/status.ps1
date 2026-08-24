<#
.SYNOPSIS
    Zeigt, welche Version auf welchem Endpunkt live ist.

.DESCRIPTION
    Die drei Web-Dienste (API, Dashboard, Mobile-Web) werden einzeln
    deployed und können daher unterschiedlich alt sein. Dieses Skript fragt
    sie von außen ab und sagt pro Dienst, was dort läuft -- ohne SSH.

    Der Trick bei der API: POST auf eine Route, die es vor dem 24.08.2026
    nicht gab. 400 heißt "Route existiert" (die Formularvalidierung schlägt
    auf den leeren Body an, es wird nichts gespeichert), 404 heißt "alter
    Code". Der Aufruf verbraucht einen von fünf Rate-Limit-Slots pro Stunde
    und IP -- also nicht in einer Schleife laufen lassen.

    Beim Dashboard sind Seiten, die es vorher nicht gab, der zuverlässigste
    Altersmarker.

.EXAMPLE
    .\scripts\deploy\status.ps1
#>

$ErrorActionPreference = "Stop"

# curl.exe explizit, nicht "curl": in Windows PowerShell 5.1 ist "curl" ein
# Alias für Invoke-WebRequest und versteht die Optionen unten nicht.
function Get-HttpCode {
    param([string]$Url, [string]$Method = "GET")
    if ($Method -eq "POST") {
        return (curl.exe -s -o NUL -w '%{http_code}' -X POST --max-time 15 $Url)
    }
    return (curl.exe -s -o NUL -w '%{http_code}' --max-time 15 $Url)
}

function Write-Row {
    param([string]$Label, [string]$Code, [string]$Meaning)
    "{0,-24} {1,-6} {2}" -f $Label, $Code, $Meaning
}

Write-Host ""
Write-Host "API  (api.velvet-network.app)" -ForegroundColor Cyan

$health = Get-HttpCode "https://api.velvet-network.app/health"
Write-Row "health" $health $(if ($health -eq "200") { "Prozess laeuft" } else { "API nicht erreichbar" })

$app = Get-HttpCode "https://api.velvet-network.app/venue-applications" "POST"
$appMeaning = switch ($app) {
    "400"   { "AKTUELL - neuer Code ist live" }
    "429"   { "AKTUELL - Route da, Rate-Limit greift" }
    "404"   { "VERALTET - Schritt 1-3 im Runbook noetig" }
    default { "unklar ($app) - Netzwerk oder Proxy pruefen" }
}
Write-Row "venue-applications" $app $appMeaning

Write-Host ""
Write-Host "Dashboard  (velvet-network.app)" -ForegroundColor Cyan

foreach ($path in "/", "/location-anmelden", "/fuer-gaeste", "/werbematerial") {
    $code = Get-HttpCode "https://velvet-network.app$path"
    $meaning = switch ($path) {
        "/location-anmelden" { if ($code -eq "200") { "Bewerbungsformular live" } else { "fehlt - Build aelter als 24.08." } }
        "/fuer-gaeste"       { if ($code -eq "200") { "Gaeste-Seite live" }       else { "fehlt - Build aelter als 24.08." } }
        default              { "" }
    }
    Write-Row $path $code $meaning
}

Write-Host ""
Write-Host "Mobile-Web  (web.velvet-network.app)" -ForegroundColor Cyan

$web = Get-HttpCode "https://web.velvet-network.app/"
Write-Row "erreichbar" $web ""
Write-Host "  Die Version laesst sich hier nicht per HTTP feststellen (Single-Page-App," -ForegroundColor DarkGray
Write-Host "  jeder Pfad gibt 200). Im Browser einloggen, 'Deine Locations' oeffnen und" -ForegroundColor DarkGray
Write-Host "  schauen, ob der 'Ausblenden'-Knopf da ist." -ForegroundColor DarkGray
Write-Host ""
