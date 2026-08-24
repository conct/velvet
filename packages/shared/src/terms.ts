import { LEGAL_OPERATOR, type LegalSection } from "./legal";

// ---------------------------------------------------------------------------
// ENTWURFSFASSUNG. Diese Texte sind eine inhaltliche Grundlage, damit Locations
// und Gäste überhaupt einen Vertrag vor sich haben — sie sind bewusst noch
// nicht anwaltlich geprüft. Vor der Einführung als verbindliche Bedingungen
// müssen sie durch eine Kanzlei laufen.
//
// TERMS_DRAFT steuert den Hinweisbalken auf den Rechtsseiten. Nach der Prüfung
// hier auf false setzen und TERMS_VERSION hochzählen — die Version ist der
// Wert, der bei der Zustimmung einer Location gespeichert wird, damit
// nachweisbar bleibt, welcher Fassung zugestimmt wurde.
// ---------------------------------------------------------------------------

export const TERMS_DRAFT = true;
export const TERMS_VERSION = "2026-08-24-entwurf";
export const TERMS_LAST_UPDATED = "24. August 2026";

export const TERMS_DRAFT_NOTICE =
  `Entwurfsfassung vom ${TERMS_LAST_UPDATED}. Dieser Text ist noch nicht anwaltlich geprüft und dient als Arbeitsgrundlage. ` +
  "Er wird vor seiner verbindlichen Einführung überarbeitet; teilnehmende Locations werden über die endgültige Fassung gesondert informiert.";

const OPERATOR_LINE = `${LEGAL_OPERATOR.name}, ${LEGAL_OPERATOR.street}, ${LEGAL_OPERATOR.postalCode} ${LEGAL_OPERATOR.city}`;

/**
 * Nutzungsvertrag zwischen VELVET und einer teilnehmenden Location. Adressat
 * ist ein Unternehmen, kein Verbraucher — deshalb kein Widerrufsrecht und ein
 * anderer Haftungsmaßstab als in den Gäste-AGB (siehe guest-terms.ts).
 */
export const LOCATION_TERMS_SECTIONS: LegalSection[] = [
  {
    heading: "§ 1 Vertragspartner und Geltungsbereich",
    paragraphs: [
      `Diese Nutzungsbedingungen regeln die Teilnahme einer Location (Club, Bar, Kneipe oder vergleichbarer Betrieb) am VELVET-Standortnetzwerk. Anbieter und Vertragspartner ist ${OPERATOR_LINE} (nachfolgend „VELVET“).`,
      "Vertragspartner auf der Gegenseite ist der Betrieb, der die Location führt (nachfolgend „die Location“), vertreten durch die im Anmeldeformular benannte Kontaktperson. Der Vertrag richtet sich ausschließlich an Unternehmer im Sinne des § 14 BGB; ein Widerrufsrecht besteht nicht.",
      "Entgegenstehende oder abweichende Bedingungen der Location werden nicht Vertragsbestandteil, es sei denn, VELVET stimmt ihnen in Textform ausdrücklich zu.",
    ],
  },
  {
    heading: "§ 2 Zustandekommen des Vertrags",
    paragraphs: [
      "Die Location bewirbt sich über das Formular unter velvet-network.app/location-anmelden und lädt dabei ihre Gewerbeanmeldung hoch. Die Bewerbung ist ein Antrag auf Aufnahme, noch kein Vertragsschluss.",
      "VELVET prüft die Gewerbeanmeldung von Hand. Der Vertrag kommt zustande, wenn VELVET die Bewerbung freigibt und den Zugang zum Location-Dashboard bereitstellt. Eine Freigabe erfolgt nie automatisch.",
      "Ein Anspruch auf Aufnahme in das Netzwerk besteht nicht. VELVET kann eine Bewerbung ablehnen; das hochgeladene Dokument wird in diesem Fall gelöscht, der Ablehnungsgrund bleibt zu Dokumentationszwecken gespeichert.",
      "Die Gewerbeanmeldung einer freigegebenen Location wird sechs Monate nach der Freigabe gelöscht. Erhalten bleibt danach nur ein Prüfvermerk mit Datum und prüfender Person.",
    ],
  },
  {
    heading: "§ 3 Leistungen von VELVET",
    paragraphs: [
      "VELVET stellt der Location ein webbasiertes Dashboard zur Verfügung, über das sie Gäste per QR-Code am Einlass erfassen, deren netzwerkweiten Status einsehen, Bewertungen abgeben, standortbezogene interne Notizen führen und eigene Team-Zugänge verwalten kann.",
      "Der netzwerkweite Status eines Gastes wird aus den Bewertungen aller teilnehmenden Locations berechnet. Ältere Bewertungen verlieren dabei planmäßig an Gewicht (Halbwertszeit 90 Tage), damit ein einzelner Vorfall nicht dauerhaft nachwirkt.",
      "VELVET schuldet keine bestimmte Zahl teilnehmender Locations, keine bestimmte Zahl erfasster Gäste und keinen wirtschaftlichen Erfolg der Teilnahme.",
      "VELVET darf den Funktionsumfang weiterentwickeln und einzelne Funktionen ändern oder einstellen, soweit der Kern der Leistung — Einlassprüfung und netzwerkweite Statusinformation — erhalten bleibt.",
    ],
  },
  {
    heading: "§ 4 Entgelte",
    paragraphs: [
      "Die Teilnahme am Netzwerk ist in der aktuellen Aufbauphase entgeltfrei. Ein Anspruch auf dauerhafte Entgeltfreiheit entsteht dadurch nicht.",
      "Die Einführung von Entgelten kündigt VELVET mindestens drei Monate vor Wirksamwerden in Textform an. Die Location kann den Vertrag bis zu diesem Zeitpunkt außerordentlich kündigen; unterbleibt eine Kündigung, gelten die angekündigten Entgelte ab dem genannten Zeitpunkt.",
    ],
  },
  {
    heading: "§ 5 Zugänge und Personal",
    paragraphs: [
      "Die Location erhält einen Zugang mit der Rolle MANAGER und legt weitere Zugänge für ihr Personal selbst an. Die Rollen sind: MANAGER (Gäste ansehen, scannen, bewerten, Team und Einstellungen verwalten), DOORMAN und SERVICE (jeweils Gäste ansehen, scannen, bewerten).",
      "Zugänge sind personengebunden und dürfen nicht geteilt werden. Die Location stellt sicher, dass jede Person mit Zugang namentlich benannt ist und über die Regeln dieses Vertrags sowie über ihre datenschutzrechtlichen Pflichten belehrt wurde.",
      "Scheidet eine Person aus oder ändert sich ihr Aufgabenbereich, entfernt die Location deren Zugang unverzüglich, spätestens am nächsten Betriebstag. Ein Verstoß hiergegen ist ein wesentlicher Vertragsverstoß.",
      "Die Location haftet für Handlungen ihres Personals im Dashboard wie für eigene Handlungen.",
    ],
  },
  {
    heading: "§ 6 Bewertungen und Hausverbote",
    paragraphs: [
      "Bewertungen und Merkmale dürfen ausschließlich auf einem konkreten, selbst beobachteten Vorfall oder Eindruck beruhen. Bewertungen ins Blaue hinein, Gefälligkeitsbewertungen und Bewertungen aus sachfremden Motiven sind untersagt.",
      "Unzulässig ist insbesondere jede Bewertung oder Sperre, die an ein Merkmal nach § 1 AGG anknüpft — Rasse oder ethnische Herkunft, Geschlecht, Religion oder Weltanschauung, Behinderung, Alter oder sexuelle Identität. Die Location weist ihr Personal hierauf ausdrücklich hin.",
      "Ein lokales Hausverbot („BANNED“) bleibt zunächst auf die vergebende Location beschränkt und ist für andere Locations als deren Entscheidung erkennbar. Zu einer netzwerkweiten Sperre führt es erst, wenn mindestens zwei voneinander unabhängige Locations dasselbe Hausverbot vergeben haben. Diese Schwelle ist ein bewusster Missbrauchsschutz und wird nicht umgangen.",
      "Das Hausrecht liegt und bleibt bei der Location. VELVET trifft keine Einlassentscheidung, sondern stellt Informationen bereit; über Einlass oder Zurückweisung entscheidet die Location in eigener Verantwortung.",
      "Stellt sich eine Bewertung oder ein Hausverbot nachträglich als unzutreffend heraus, korrigiert oder widerruft die Location den Eintrag unverzüglich. Ist der Eintrag nicht mehr selbst korrigierbar, wendet sich die Location an VELVET.",
    ],
  },
  {
    heading: "§ 7 Umgang mit Gastdaten",
    paragraphs: [
      "Die im Dashboard sichtbaren Gastdaten — Profilfoto, Name, Status, Bewertungsverlauf, Notizen anderer Locations — dürfen ausschließlich zum Zweck der Einlassprüfung und der Sicherheit im eigenen Betrieb verwendet werden.",
      "Untersagt sind insbesondere: das Anfertigen von Kopien, Screenshots oder Ausdrucken über den betrieblichen Anlass hinaus, die Weitergabe an Dritte außerhalb des Netzwerks, die Nutzung für Werbung sowie jede Verwendung zu privaten Zwecken.",
      "Die datenschutzrechtliche Rollenverteilung zwischen VELVET und der Location regelt die Anlage 1 (Vereinbarung über die gemeinsame Verarbeitung nach Art. 26 DSGVO). Sie ist Bestandteil dieses Vertrags.",
    ],
  },
  {
    heading: "§ 8 Verfügbarkeit",
    paragraphs: [
      "VELVET betreibt den Dienst mit der Sorgfalt eines ordentlichen Kaufmanns, schuldet aber keine bestimmte Verfügbarkeit. Wartungsarbeiten werden nach Möglichkeit außerhalb der üblichen Öffnungszeiten durchgeführt.",
      "Die Location hält für den Fall einer Störung ein Einlassverfahren ohne VELVET bereit. Der Dienst ersetzt keine eigene Einlassorganisation.",
    ],
  },
  {
    heading: "§ 9 Stilllegung",
    paragraphs: [
      "VELVET kann eine Location vorübergehend stilllegen („SUSPENDED“), wenn ein begründeter Verdacht auf einen Verstoß gegen § 5, § 6 oder § 7 besteht, wenn die Angaben der Location unrichtig sind oder wenn der Betrieb erkennbar eingestellt wurde.",
      "Während einer Stilllegung sind keine neuen Scans und Bewertungen möglich und die Location erscheint nicht in der öffentlichen Liste. Bereits vorhandene Bewertungen bleiben bestehen, da sie zur Historie der betroffenen Gäste gehören.",
      "VELVET teilt der Location die Stilllegung und deren Grund mit und gibt ihr Gelegenheit zur Stellungnahme. Bestätigt sich der Verdacht nicht, wird die Stilllegung aufgehoben.",
    ],
  },
  {
    heading: "§ 10 Laufzeit und Kündigung",
    paragraphs: [
      "Der Vertrag läuft auf unbestimmte Zeit. Beide Seiten können ihn jederzeit mit einer Frist von 14 Tagen in Textform kündigen; das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.",
      "Ein wichtiger Grund liegt für VELVET insbesondere bei wiederholten oder schwerwiegenden Verstößen gegen § 6 oder § 7 vor.",
      "Mit Wirksamwerden der Kündigung werden alle Zugänge der Location deaktiviert und die Location aus der öffentlichen Liste entfernt. Von ihr vergebene Bewertungen und Hausverbote bleiben Teil der Historie der betroffenen Gäste; auf Verlangen der Location wird ihr Name in diesen Einträgen durch eine neutrale Bezeichnung ersetzt.",
    ],
  },
  {
    heading: "§ 11 Haftung",
    paragraphs: [
      "VELVET haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei der Verletzung von Leben, Körper und Gesundheit.",
      "Bei einfacher Fahrlässigkeit haftet VELVET nur bei der Verletzung einer wesentlichen Vertragspflicht — einer Pflicht, deren Erfüllung die ordnungsgemäße Durchführung des Vertrags überhaupt erst ermöglicht und auf deren Einhaltung die Location regelmäßig vertrauen darf — und der Höhe nach begrenzt auf den vertragstypischen, vorhersehbaren Schaden.",
      "Die Haftung nach dem Produkthaftungsgesetz und für die Verletzung datenschutzrechtlicher Pflichten bleibt unberührt.",
    ],
  },
  {
    heading: "§ 12 Freistellung",
    paragraphs: [
      "Die Location stellt VELVET von Ansprüchen Dritter frei, die darauf beruhen, dass die Location oder ihr Personal eine Bewertung oder ein Hausverbot ohne sachlichen Grund, aus einem nach § 1 AGG unzulässigen Motiv oder unter Verstoß gegen § 7 vergeben oder Gastdaten unbefugt verwendet hat.",
      "Die Freistellung umfasst die angemessenen Kosten der Rechtsverteidigung. VELVET unterrichtet die Location unverzüglich über einen geltend gemachten Anspruch und stimmt sich mit ihr ab, bevor sie ihn anerkennt oder vergleicht.",
    ],
  },
  {
    heading: "§ 13 Änderungen dieser Bedingungen",
    paragraphs: [
      "VELVET kann diese Bedingungen ändern, wenn dies wegen einer Änderung der Rechtslage, der Rechtsprechung oder des Funktionsumfangs erforderlich ist. Änderungen werden der Location mindestens sechs Wochen vor Wirksamwerden in Textform mitgeteilt.",
      "Widerspricht die Location nicht bis zum Wirksamwerden, gilt die geänderte Fassung als angenommen; auf diese Wirkung wird in der Mitteilung gesondert hingewiesen. Im Fall des Widerspruchs kann jede Seite den Vertrag zum Zeitpunkt des Wirksamwerdens kündigen.",
      "Welcher Fassung eine Location zugestimmt hat, wird mit Versionsnummer und Zeitpunkt dokumentiert.",
    ],
  },
  {
    heading: "§ 14 Schlussbestimmungen",
    paragraphs: [
      "Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.",
      "Ist die Location Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist ausschließlicher Gerichtsstand der Sitz von VELVET.",
      "Änderungen und Ergänzungen dieses Vertrags bedürfen der Textform. Sollte eine Bestimmung unwirksam sein, bleibt der Vertrag im Übrigen wirksam.",
      `Kontakt für alle Fragen zu diesem Vertrag: ${LEGAL_OPERATOR.email}.`,
    ],
  },
];

/**
 * Anlage 1 zum Location-Nutzungsvertrag: Art. 26 DSGVO. Die Location verfolgt
 * mit der Einlasskontrolle einen eigenen Zweck, ist also nicht bloße
 * Auftragsverarbeiterin — deshalb gemeinsame Verantwortlichkeit und nicht AVV.
 * Der „wesentliche Inhalt“ dieser Vereinbarung muss betroffenen Gästen
 * zugänglich sein (Art. 26 Abs. 2 S. 2), was über diese öffentliche Seite und
 * den Verweis in der Datenschutzerklärung geschieht.
 */
export const JOINT_CONTROLLER_SECTIONS: LegalSection[] = [
  {
    heading: "Anlage 1 — Gegenstand und Parteien",
    paragraphs: [
      `Diese Vereinbarung nach Art. 26 DSGVO wird geschlossen zwischen ${OPERATOR_LINE} („VELVET“) und der teilnehmenden Location. Sie ist Bestandteil des Nutzungsvertrags.`,
      "VELVET und die Location legen Zwecke und Mittel der Verarbeitung von Gastdaten im Netzwerk gemeinsam fest und sind daher gemeinsam Verantwortliche. Eine Auftragsverarbeitung nach Art. 28 DSGVO liegt nicht vor, weil die Location die Daten für einen eigenen Zweck — die Ausübung ihres Hausrechts — verwendet.",
    ],
  },
  {
    heading: "Gemeinsam verarbeitete Daten und Zwecke",
    paragraphs: [
      "Gegenstand der gemeinsamen Verarbeitung sind: Name und Profilfoto des Gastes, der netzwerkweite Status und Score, Sterne-Bewertungen und Merkmale, lokale Kennzeichnungen einschließlich Hausverboten, Zeitpunkt und Ort von Einlass-Scans sowie standortbezogene interne Notizen.",
      "Zwecke sind die Prüfung am Einlass, die Sicherheit in den teilnehmenden Betrieben und die netzwerkweite Information über einschlägige Vorfälle. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO für die Bereitstellung der App-Funktionen gegenüber dem Gast und Art. 6 Abs. 1 lit. f DSGVO für die Einlasskontrolle im berechtigten Interesse der Locations.",
      "Eine Verarbeitung zu anderen Zwecken — insbesondere Werbung, Profilbildung außerhalb des Einlasskontexts oder Weitergabe an Dritte außerhalb des Netzwerks — findet nicht statt.",
    ],
  },
  {
    heading: "Aufgabenverteilung",
    paragraphs: [
      "VELVET betreibt die Plattform, bestimmt die technische Ausgestaltung, berechnet Score und Status, erfüllt die Informationspflichten nach Art. 13 und 14 DSGVO über die Datenschutzerklärung und ist zentrale Anlaufstelle für Betroffenenanfragen.",
      "Die Location entscheidet über die Erhebung am Einlass, die Vergabe von Bewertungen, Merkmalen, Notizen und Hausverboten und über die Vergabe und den Entzug der Zugänge ihres Personals. Für die Richtigkeit der von ihr eingetragenen Daten ist sie verantwortlich.",
      "Die Location belehrt ihr Personal über die Vertraulichkeit und dokumentiert diese Belehrung.",
    ],
  },
  {
    heading: "Anlaufstelle und Betroffenenrechte",
    paragraphs: [
      `Betroffene Gäste können ihre Rechte nach Art. 15 bis 22 DSGVO gegenüber jedem der beiden Verantwortlichen geltend machen. Als gemeinsame Anlaufstelle benennen die Parteien VELVET: ${LEGAL_OPERATOR.email}.`,
      "Geht ein Antrag bei der Location ein, leitet sie ihn unverzüglich, spätestens innerhalb von drei Werktagen, an VELVET weiter und unterstützt bei der Beantwortung, soweit die Auskunft ihre eigenen Einträge betrifft.",
      "Verlangt ein Gast die Berichtigung oder Löschung eines Eintrags, den die Location vorgenommen hat, prüft die Location den Sachverhalt unverzüglich und teilt VELVET das Ergebnis mit. Ist der Eintrag unzutreffend, wird er berichtigt oder gelöscht.",
    ],
  },
  {
    heading: "Sicherheit der Verarbeitung",
    paragraphs: [
      "VELVET trifft die technischen und organisatorischen Maßnahmen für Plattform und Infrastruktur (Art. 32 DSGVO): verschlüsselte Übertragung, Passwörter ausschließlich als Hash, rollenbasierte Zugriffsbeschränkung, Serverstandort Deutschland, getrennte Ablage vertraulicher Dokumente außerhalb öffentlich ausgelieferter Verzeichnisse.",
      "Die Location sichert die Endgeräte, auf denen das Dashboard genutzt wird, gegen unbefugten Zugriff, hält Zugangsdaten geheim und stellt sicher, dass Gastdaten am Einlass nicht für unbeteiligte Dritte einsehbar sind.",
    ],
  },
  {
    heading: "Verletzungen des Schutzes personenbezogener Daten",
    paragraphs: [
      "Die Location informiert VELVET unverzüglich, spätestens innerhalb von 24 Stunden nach Kenntnis, über jede Verletzung des Schutzes von Gastdaten in ihrem Verantwortungsbereich — etwa einen kompromittierten Zugang oder ein verlorenes Endgerät mit aktiver Sitzung.",
      "Die Meldung an die Aufsichtsbehörde nach Art. 33 DSGVO und die Benachrichtigung betroffener Gäste nach Art. 34 DSGVO übernimmt VELVET; die kurze interne Frist stellt sicher, dass die 72-Stunden-Frist eingehalten werden kann.",
    ],
  },
  {
    heading: "Speicherdauer und Löschung",
    paragraphs: [
      "Gastdaten werden gespeichert, solange das Konto des Gastes besteht. Nach dessen Löschung werden sie entfernt, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
      "Endet die Teilnahme einer Location, verliert sie mit sofortiger Wirkung jeden Zugriff auf Gastdaten. Von ihr vergebene Bewertungen bleiben als Teil der Gästehistorie bestehen; sie sind ab diesem Zeitpunkt allein VELVET zuzuordnen.",
      "Die Location bewahrt keine eigenen Kopien von Gastdaten auf. Etwa vorhandene Kopien vernichtet sie bei Vertragsende unverzüglich.",
    ],
  },
  {
    heading: "Haftung im Außenverhältnis",
    paragraphs: [
      "Im Verhältnis zu betroffenen Gästen haften VELVET und die Location nach Art. 82 Abs. 4 DSGVO gesamtschuldnerisch.",
      "Im Innenverhältnis trägt diejenige Partei den Schaden, die ihn verursacht hat. Wird eine Partei in Anspruch genommen, obwohl die andere den Verstoß zu vertreten hat, kann sie bei dieser Rückgriff nehmen.",
    ],
  },
  {
    heading: "Wesentlicher Inhalt für betroffene Personen",
    paragraphs: [
      "Der wesentliche Inhalt dieser Vereinbarung wird betroffenen Gästen nach Art. 26 Abs. 2 Satz 2 DSGVO über diese öffentlich abrufbare Seite und einen Verweis in der Datenschutzerklärung zur Verfügung gestellt.",
      "Unabhängig von der internen Aufgabenverteilung können Gäste ihre Rechte gegenüber jedem der beiden Verantwortlichen geltend machen.",
    ],
  },
];
