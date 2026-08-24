export const LEGAL_OPERATOR = {
  name: "Daniel von Lühmann",
  street: "Hauptstr. 154",
  postalCode: "01833",
  city: "Dürrröhrsdorf-Dittersbach",
  email: "mail@velvet-network.app",
  phone: "061194584300",
  taxNumber: "210/246/14465",
} as const;

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export const IMPRESSUM_SECTIONS: LegalSection[] = [
  {
    heading: "Angaben gemäß § 5 TMG / § 5 DDG",
    paragraphs: [
      LEGAL_OPERATOR.name,
      LEGAL_OPERATOR.street,
      `${LEGAL_OPERATOR.postalCode} ${LEGAL_OPERATOR.city}`,
    ],
  },
  {
    heading: "Kontakt",
    paragraphs: [`E-Mail: ${LEGAL_OPERATOR.email}`, `Telefon: ${LEGAL_OPERATOR.phone}`],
  },
  {
    heading: "Steuernummer",
    paragraphs: [LEGAL_OPERATOR.taxNumber],
  },
  {
    heading: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
    paragraphs: [
      LEGAL_OPERATOR.name,
      LEGAL_OPERATOR.street,
      `${LEGAL_OPERATOR.postalCode} ${LEGAL_OPERATOR.city}`,
    ],
  },
  {
    heading: "Streitschlichtung",
    paragraphs: [
      "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/.",
      "Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
    ],
  },
  {
    heading: "Haftung für Inhalte",
    paragraphs: [
      "Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.",
    ],
  },
];

export const DATENSCHUTZ_SECTIONS: LegalSection[] = [
  {
    heading: "Verantwortlicher",
    paragraphs: [
      `${LEGAL_OPERATOR.name}, ${LEGAL_OPERATOR.street}, ${LEGAL_OPERATOR.postalCode} ${LEGAL_OPERATOR.city}`,
      `E-Mail: ${LEGAL_OPERATOR.email}`,
    ],
  },
  {
    heading: "Welche Daten VELVET verarbeitet",
    paragraphs: [
      "Registrierung & Login: E-Mail-Adresse, Passwort (ausschließlich als Hash gespeichert, im Klartext nicht einsehbar), Vor- und Nachname sowie das Geburtsdatum.",
      "Geburtsdatum: bei der Registrierung erhoben, um das in den Nutzungsbedingungen vorausgesetzte Mindestalter von 18 Jahren zu prüfen und nachweisen zu können. Es ist für teilnehmende Locations nicht sichtbar und wird zu keinem anderen Zweck verwendet.",
      "Profilfoto: freiwillig hochgeladen, dient der Identifikation am Einlass.",
      "Bewertungen & Status: von Türsteher:innen vergebene Sterne-Bewertung und Merkmale (z. B. „Freundlich“, „Ärger gemacht“), daraus errechneter globaler Status und Score.",
      "Einlass-Historie: Zeitpunkt und Location eines QR-Scans am Einlass.",
      "Interne Notizen: standortbezogene Vermerke des Personals, für Gäste nicht einsehbar.",
      "Team-Zugänge: E-Mail-Adresse, Name und Rolle von Mitarbeitenden teilnehmender Locations.",
      "Premium-Abonnement: Abo-Status, Laufzeit und Zahlungsanbieter (nicht die Zahlungsdaten selbst, siehe unten).",
      "Widerrufs-Zustimmung: beim Abschluss eines Premium-Abos der Wortlaut der Zustimmung zum sofortigen Beginn, die gewählte Sprachfassung, Zahlungsanbieter, Laufzeit und Zeitpunkt — als Nachweis nach § 356 Abs. 5 BGB.",
      "Private Nachrichten: Inhalte von Nachrichten zwischen Premium-Mitgliedern, die sich am selben Abend in derselben Location aufgehalten haben.",
    ],
  },
  {
    heading: "Zwecke und Rechtsgrundlagen",
    paragraphs: [
      "Bereitstellung der App-Funktionen (Profil, Einlass per QR-Code, Bewertungsverlauf): Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).",
      "Zutrittskontrolle und Sicherheit am Einlass im Interesse der teilnehmenden Locations: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).",
    ],
  },
  {
    heading: "Empfänger der Daten",
    paragraphs: [
      "Profilfoto, globaler Status und Bewertungsverlauf sind für Türsteher:innen, Sicherheitspersonal und Management aller am Netzwerk teilnehmenden Locations einsehbar — nicht nur der zuletzt besuchten. Das ist Kernfunktion von VELVET: ein an einer Location vergebenes Hausverbot ist an jeder anderen Tür im Netzwerk sichtbar.",
      "Eine Weitergabe an Dritte außerhalb des Netzwerks teilnehmender Locations findet nicht statt.",
    ],
  },
  {
    heading: "Gemeinsame Verantwortlichkeit mit den teilnehmenden Locations",
    paragraphs: [
      "Eine teilnehmende Location entscheidet selbst, ob sie einen Gast einlässt, und vergibt Bewertungen, Merkmale und Hausverbote in eigener Verantwortung. Sie verfolgt damit einen eigenen Zweck — die Ausübung ihres Hausrechts. VELVET und die jeweilige Location sind für diese Verarbeitung deshalb gemeinsam Verantwortliche im Sinne des Art. 26 DSGVO.",
      "Der wesentliche Inhalt der dazu geschlossenen Vereinbarung ist unter velvet-network.app/location-bedingungen als Anlage 1 abrufbar. Danach betreibt VELVET die Plattform, berechnet Status und Score, erfüllt die Informationspflichten und ist zentrale Anlaufstelle für Anfragen; die Location verantwortet die Richtigkeit ihrer Einträge und die Zugänge ihres Personals.",
      `Unabhängig von dieser Aufteilung können Sie Ihre Rechte gegenüber jedem der beiden Verantwortlichen geltend machen. Als gemeinsame Anlaufstelle steht Ihnen ${LEGAL_OPERATOR.email} zur Verfügung; Anfragen, die eine einzelne Location betreffen, leiten wir dorthin weiter und holen eine Stellungnahme ein.`,
      "Halten Sie eine Bewertung oder ein Hausverbot für unzutreffend, prüfen wir den Sachverhalt gemeinsam mit der Location. Ein unzutreffender Eintrag wird berichtigt oder gelöscht.",
    ],
  },
  {
    heading: "Premium-Abonnement & Zahlungen",
    paragraphs: [
      "Für das kostenpflichtige Premium-Abonnement (monatlich oder jährlich) bieten wir Zahlungen über Stripe und PayPal an. Zahlungsdaten (z. B. Kartennummern oder PayPal-Zugangsdaten) werden ausschließlich von Stripe bzw. PayPal als Zahlungsdienstleister verarbeitet — VELVET selbst sieht oder speichert diese Daten nicht, sondern erhält von Stripe/PayPal nur den Abo-Status, die Laufzeit (monatlich/jährlich) und das Verlängerungsdatum.",
      "Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Erfüllung des Abo-Vertrags). Stripe und PayPal agieren dabei als eigenständige Verantwortliche bzw. Auftragsverarbeiter außerhalb des VELVET-Standortnetzwerks; je nach vertraglicher Konstellation kann dies eine Datenübermittlung außerhalb der EU einschließen — Details entnehmen Sie den Datenschutzhinweisen von Stripe und PayPal.",
      "Vor dem Abschluss fragt der Checkout ausdrücklich ab, ob die Leistung sofort — also vor Ablauf der 14-tägigen Widerrufsfrist — beginnen soll und ob die Kenntnis vom Erlöschen des Widerrufsrechts bestätigt wird (§ 356 Abs. 5 BGB). Diese Erklärung wird mit dem angezeigten Wortlaut, der Sprachfassung und dem Zeitpunkt gespeichert; Rechtsgrundlage ist Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung) in Verbindung mit dem berechtigten Interesse an der Beweisbarkeit nach Art. 6 Abs. 1 lit. f DSGVO. Die Aufzeichnung wird mit dem Konto gelöscht.",
    ],
  },
  {
    heading: "Private Nachrichten (Premium)",
    paragraphs: [
      "Premium-Mitglieder, die nachweislich am selben Abend in derselben Location eingecheckt waren, können sich gegenseitig Nachrichten schreiben, um sich zu verabreden. Ohne diese gemeinsame, verifizierte Anwesenheit ist kein Nachrichtenkontakt zwischen Gästen möglich.",
      "Nachrichteninhalte werden gespeichert, damit beide Beteiligten den Verlauf einsehen können, und sind ausschließlich für die beiden am Gespräch beteiligten Personen sichtbar. Zum Schutz vor Missbrauch können Nutzer:innen andere blockieren oder einzelne Nachrichten melden; gemeldete Inhalte werden zur Prüfung aufbewahrt.",
      "Der Betreiber kann im Einzelfall zur Aufklärung gemeldeter Verstöße auf Nachrichteninhalte zugreifen — mit derselben Offenheit, mit der auch die standortübergreifende Sichtbarkeit von Bewertungen oben beschrieben ist.",
    ],
  },
  {
    heading: "Speicherdauer",
    paragraphs: [
      "Daten werden gespeichert, solange ein Konto besteht. Nach Löschung des Kontos werden die Daten entfernt, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
    ],
  },
  {
    heading: "Hosting und technische Infrastruktur",
    paragraphs: [
      "VELVET wird bei einem Hosting-Anbieter mit Serverstandort Deutschland betrieben. Zugriffsdaten werden ausschließlich zum technischen Betrieb der Anwendung verarbeitet.",
    ],
  },
  {
    heading: "Lokale Speicherung",
    paragraphs: [
      "Der Anmeldestatus wird technisch notwendig lokal gespeichert (im Dashboard über den Local Storage des Browsers, in der App über den sicheren Gerätespeicher). Es werden keine Tracking- oder Werbe-Cookies eingesetzt.",
    ],
  },
  {
    heading: "Rechte der betroffenen Personen",
    paragraphs: [
      "Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten (Art. 15–21 DSGVO).",
    ],
  },
  {
    heading: "Beschwerderecht",
    paragraphs: [
      "Sie haben das Recht, sich bei der zuständigen Datenschutzaufsichtsbehörde zu beschweren.",
    ],
  },
  {
    heading: "Kontakt für Datenschutzanfragen",
    paragraphs: [LEGAL_OPERATOR.email],
  },
];
