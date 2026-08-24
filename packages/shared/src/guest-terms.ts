import { LEGAL_OPERATOR, type LegalSection } from "./legal";
import { TERMS_VERSION } from "./terms";
import type { Locale } from "./i18n";

// ---------------------------------------------------------------------------
// ENTWURFSFASSUNG — siehe Kopf von terms.ts. Diese AGB richten sich an
// Verbraucher, weil das Premium-Abo über Stripe und PayPal kostenpflichtig
// verkauft wird (server/src/routes/subscriptions.ts). Daraus folgen zwei
// Dinge, die es vor dem Verkauf an echte Kundschaft geben muss: diese AGB und
// die Widerrufsbelehrung weiter unten.
// ---------------------------------------------------------------------------

const OPERATOR_LINE = `${LEGAL_OPERATOR.name}, ${LEGAL_OPERATOR.street}, ${LEGAL_OPERATOR.postalCode} ${LEGAL_OPERATOR.city}`;

export const GUEST_TERMS_SECTIONS: LegalSection[] = [
  {
    heading: "§ 1 Anbieter und Geltungsbereich",
    paragraphs: [
      `Anbieter der VELVET-App und des VELVET-Netzwerks ist ${OPERATOR_LINE} (nachfolgend „VELVET“).`,
      "Diese Bedingungen gelten für die Nutzung der VELVET-App und der Web-Version durch Gäste, einschließlich des kostenpflichtigen Premium-Abonnements. Für teilnehmende Locations gelten gesonderte Bedingungen.",
    ],
  },
  {
    heading: "§ 2 Konto und Mindestalter",
    paragraphs: [
      "Die Nutzung setzt ein Konto voraus. Erforderlich sind Vor- und Nachname, das Geburtsdatum, eine E-Mail-Adresse und ein Profilfoto; die E-Mail-Adresse muss vor der ersten Anmeldung bestätigt werden.",
      "Das Konto ist volljährigen Personen vorbehalten. Bei der Registrierung wird dein Geburtsdatum erfasst; liegt es weniger als 18 Jahre zurück, kann kein Konto angelegt werden. Das Geburtsdatum dient allein diesem Nachweis und ist für teilnehmende Locations nicht sichtbar.",
      "Angaben müssen wahr sein. Das Profilfoto muss dich erkennbar zeigen, weil es am Einlass zum Abgleich dient — ein Foto, das eine andere Person, eine Sachaufnahme oder eine Grafik zeigt, ist nicht zulässig.",
      "Das Konto ist persönlich. Zugangsdaten dürfen nicht weitergegeben werden, der QR-Code nicht für den Einlass einer anderen Person verwendet werden.",
    ],
  },
  {
    heading: "§ 3 Leistungen im kostenfreien Umfang",
    paragraphs: [
      "Im kostenfreien Umfang kannst du deinen QR-Code am Einlass teilnehmender Locations vorzeigen, deinen eigenen Status und Bewertungsverlauf einsehen, deine besuchten Locations verwalten und Einladungscodes an andere Gäste weitergeben.",
      "VELVET schuldet keine bestimmte Zahl teilnehmender Locations und keinen Einlass. Ob du eingelassen wirst, entscheidet allein die Location im Rahmen ihres Hausrechts.",
    ],
  },
  {
    heading: "§ 4 Bewertungen, Status und Hausverbote",
    paragraphs: [
      "Teilnehmende Locations können nach einem Besuch eine Sterne-Bewertung und Merkmale vergeben. Daraus wird ein netzwerkweiter Score berechnet, aus dem sich dein Status ergibt: VIP, TRUSTED, STANDARD oder WATCH.",
      "Ältere Bewertungen verlieren planmäßig an Gewicht — nach 90 Tagen zählt eine Bewertung nur noch halb so viel. Ein einzelner schlechter Abend wirkt deshalb nicht dauerhaft nach.",
      "Eine Location kann zusätzlich ein Hausverbot für ihren eigenen Betrieb vergeben. Netzwerkweit gesperrt wirst du erst, wenn mindestens zwei voneinander unabhängige Locations ein Hausverbot vergeben haben.",
      "Profilfoto, Status und Bewertungsverlauf sind für das Personal aller teilnehmenden Locations sichtbar — das ist die Kernfunktion von VELVET und in der Datenschutzerklärung im Einzelnen beschrieben.",
      "Hältst du eine Bewertung oder ein Hausverbot für unzutreffend, kannst du dich an VELVET wenden. Wir holen eine Stellungnahme der Location ein; ein unzutreffender Eintrag wird berichtigt oder gelöscht.",
    ],
  },
  {
    heading: "§ 5 Premium-Abonnement",
    paragraphs: [
      "Das Premium-Abonnement ist kostenpflichtig und schaltet zusätzliche Funktionen frei, insbesondere private Nachrichten an andere Premium-Mitglieder sowie Nachrichten von Locations, deren Gast du bist.",
      "Es wird wahlweise mit monatlicher oder jährlicher Laufzeit angeboten. Der jeweils geltende Preis einschließlich Umsatzsteuer wird dir vor dem Abschluss im Bestellvorgang angezeigt; maßgeblich ist der dort angezeigte Preis.",
      "Der Vertrag kommt zustande, wenn du den kostenpflichtigen Abschluss bestätigst und der Zahlungsdienstleister die Zahlung bestätigt.",
      "Das Abonnement verlängert sich nach Ablauf der gewählten Laufzeit automatisch auf unbestimmte Zeit und kann dann jederzeit mit einer Frist von einem Monat gekündigt werden. Die Kündigung ist in der App über die Abo-Verwaltung möglich.",
      "Die Zahlung wird über Stripe oder PayPal abgewickelt. Zahlungsdaten verarbeitet allein der jeweilige Zahlungsdienstleister; VELVET erhält nur Abo-Status, Laufzeit und Verlängerungsdatum.",
      "Endet das Abonnement, bleiben bereits geführte Nachrichtenverläufe für beide Beteiligten sichtbar; neue Nachrichten können ohne Premium nicht mehr geschrieben werden.",
    ],
  },
  {
    heading: "§ 6 Widerrufsrecht",
    paragraphs: [
      "Als Verbraucher steht dir beim Abschluss des Premium-Abonnements ein gesetzliches Widerrufsrecht zu. Die Einzelheiten und die Folgen ergeben sich aus der Widerrufsbelehrung, die als eigener Text abrufbar ist und dir bei Vertragsschluss übermittelt wird.",
      "Das Premium-Abonnement ist eine digitale Dienstleistung, die sofort freigeschaltet wird. Damit das möglich ist, fragt der Bestellvorgang deine ausdrückliche Zustimmung zum sofortigen Beginn ab, verbunden mit der Bestätigung, dass du dein Widerrufsrecht mit der vollständigen Vertragserfüllung verlierst (§ 356 Abs. 5 BGB). Ohne diese Zustimmung kann das Abo nicht abgeschlossen werden; erteilst du sie, halten wir ihren Wortlaut und den Zeitpunkt fest.",
    ],
  },
  {
    heading: "§ 7 Private Nachrichten",
    paragraphs: [
      "Nachrichten zwischen Gästen sind nur möglich, wenn beide Premium-Mitglieder sind und am selben Abend in derselben Location eingecheckt waren, oder wenn eine Verbindung über einen Einladungscode angenommen wurde. Ohne diese Voraussetzung besteht kein Nachrichtenkontakt.",
      "Beleidigende, bedrohende, sexuell belästigende oder werbliche Nachrichten sind untersagt. Du kannst andere Nutzer:innen blockieren und einzelne Nachrichten melden.",
      "Gemeldete Inhalte werden zur Prüfung aufbewahrt. VELVET kann im Einzelfall zur Aufklärung eines gemeldeten Verstoßes auf Nachrichteninhalte zugreifen.",
    ],
  },
  {
    heading: "§ 8 Deine Pflichten",
    paragraphs: [
      "Untersagt sind insbesondere: falsche Angaben zur eigenen Person, die Nutzung eines fremden Kontos oder QR-Codes, der Versuch, Bewertungen oder den eigenen Status technisch zu beeinflussen, sowie das automatisierte Auslesen der App.",
      "Du bist für die Aktivitäten unter deinem Konto verantwortlich. Bei Verdacht auf unbefugten Zugriff ändere dein Passwort und informiere uns.",
    ],
  },
  {
    heading: "§ 9 Sperrung und Kündigung",
    paragraphs: [
      "Bei einem erheblichen oder wiederholten Verstoß gegen diese Bedingungen kann VELVET das Konto vorübergehend sperren oder außerordentlich kündigen. Vor einer dauerhaften Sperrung wirst du angehört, soweit dem nicht ein überwiegendes Interesse entgegensteht.",
      "Du kannst dein Konto jederzeit ohne Frist löschen. Ein laufendes Premium-Abonnement musst du zusätzlich über die Abo-Verwaltung kündigen; die Kontolöschung allein beendet es nicht.",
      "Nach der Löschung werden deine Daten entfernt, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Einzelheiten stehen in der Datenschutzerklärung.",
    ],
  },
  {
    heading: "§ 10 Verfügbarkeit und Haftung",
    paragraphs: [
      "VELVET betreibt den Dienst mit angemessener Sorgfalt, schuldet aber keine bestimmte Verfügbarkeit.",
      "VELVET haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei der Verletzung von Leben, Körper und Gesundheit. Bei einfacher Fahrlässigkeit haftet VELVET nur bei der Verletzung einer wesentlichen Vertragspflicht und begrenzt auf den vertragstypischen, vorhersehbaren Schaden.",
      "Für die Entscheidung einer Location über Einlass oder Zurückweisung und für die von ihr vergebenen Bewertungen haftet die jeweilige Location. Die Haftung nach dem Produkthaftungsgesetz und für die Verletzung datenschutzrechtlicher Pflichten bleibt unberührt.",
    ],
  },
  {
    heading: "§ 11 Änderungen dieser Bedingungen",
    paragraphs: [
      "VELVET kann diese Bedingungen ändern, wenn dies wegen einer Änderung der Rechtslage, der Rechtsprechung oder des Funktionsumfangs erforderlich ist. Über Änderungen wirst du mindestens sechs Wochen vor Wirksamwerden per E-Mail oder in der App informiert.",
      "Widersprichst du nicht bis zum Wirksamwerden, gilt die geänderte Fassung als angenommen; auf diese Wirkung wirst du in der Mitteilung gesondert hingewiesen. Widersprichst du, kann jede Seite den Vertrag zu diesem Zeitpunkt kündigen.",
    ],
  },
  {
    heading: "§ 12 Schlussbestimmungen",
    paragraphs: [
      "Es gilt deutsches Recht. Zwingende Verbraucherschutzvorschriften des Staates, in dem du deinen gewöhnlichen Aufenthalt hast, bleiben unberührt.",
      "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: https://ec.europa.eu/consumers/odr/. Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
      `Fragen zu diesen Bedingungen: ${LEGAL_OPERATOR.email}.`,
    ],
  },
];

/**
 * Widerrufsbelehrung für das Premium-Abo. Digitale Dienstleistung, also
 * erlischt das Widerrufsrecht nur bei ausdrücklicher Zustimmung zum
 * vorzeitigen Beginn plus Kenntnisnahme des Erlöschens (§ 356 Abs. 5 BGB) —
 * beides muss der Checkout abfragen und protokollieren, sonst läuft die
 * 14-Tage-Frist trotz sofortiger Freischaltung weiter.
 */
export const WIDERRUF_SECTIONS: LegalSection[] = [
  {
    heading: "Widerrufsrecht",
    paragraphs: [
      "Du hast das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.",
      "Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.",
      `Um dein Widerrufsrecht auszuüben, musst du uns (${OPERATOR_LINE}, E-Mail: ${LEGAL_OPERATOR.email}) mittels einer eindeutigen Erklärung — zum Beispiel per E-Mail — über deinen Entschluss, diesen Vertrag zu widerrufen, informieren. Du kannst dafür das unten stehende Muster-Widerrufsformular verwenden, das aber nicht vorgeschrieben ist.`,
      "Zur Wahrung der Widerrufsfrist reicht es aus, dass du die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absendest.",
    ],
  },
  {
    heading: "Folgen des Widerrufs",
    paragraphs: [
      "Wenn du diesen Vertrag widerrufst, haben wir dir alle Zahlungen, die wir von dir erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über deinen Widerruf bei uns eingegangen ist.",
      "Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das du bei der ursprünglichen Transaktion eingesetzt hast, es sei denn, mit dir wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden dir wegen dieser Rückzahlung Entgelte berechnet.",
      "Hast du verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen soll, so hast du uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zum Widerruf bereits erbrachten Leistung im Vergleich zum Gesamtumfang der vertraglich vereinbarten Leistung entspricht.",
    ],
  },
  {
    heading: "Vorzeitiges Erlöschen des Widerrufsrechts",
    paragraphs: [
      "Das Widerrufsrecht erlischt vorzeitig, wenn wir die Dienstleistung vollständig erbracht haben und mit der Ausführung erst begonnen haben, nachdem du dazu deine ausdrückliche Zustimmung gegeben und gleichzeitig deine Kenntnis davon bestätigt hast, dass du dein Widerrufsrecht bei vollständiger Vertragserfüllung verlierst.",
    ],
  },
  {
    heading: "Muster-Widerrufsformular",
    paragraphs: [
      "(Wenn du den Vertrag widerrufen willst, fülle dieses Formular aus und sende es zurück.)",
      `An ${OPERATOR_LINE}, E-Mail: ${LEGAL_OPERATOR.email}:`,
      "Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung: VELVET Premium-Abonnement",
      "Bestellt am (*)/erhalten am (*)",
      "Name des/der Verbraucher(s)",
      "Anschrift des/der Verbraucher(s)",
      "Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)",
      "Datum",
      "(*) Unzutreffendes streichen.",
    ],
  },
];

// ---------------------------------------------------------------------------
// Zustimmung zum sofortigen Beginn im Premium-Checkout
// ---------------------------------------------------------------------------
// § 356 Abs. 5 BGB verlangt zweierlei, bevor das Widerrufsrecht bei einer
// digitalen Dienstleistung vorzeitig erlöschen kann: die ausdrückliche
// Zustimmung zum Beginn vor Ablauf der Frist *und* die Bestätigung, das
// Widerrufsrecht dadurch zu verlieren. Beides steht deshalb in einem Satz
// zusammen in einer Pflicht-Checkbox, die der Checkout abfragt.
//
// Protokolliert wird nicht nur „hat zugestimmt“, sondern der Wortlaut, den
// die Person tatsächlich gesehen hat (WITHDRAWAL_CONSENT_TEXT[locale]) plus
// WITHDRAWAL_CONSENT_VERSION — sonst ist bei einer späteren Textänderung
// nicht mehr belegbar, worauf sich die Zustimmung bezog.

export const WITHDRAWAL_CONSENT_VERSION = TERMS_VERSION;

export const WITHDRAWAL_CONSENT_TEXT: Record<Locale, string> = {
  de:
    "Ich verlange ausdrücklich, dass VELVET mit dem Premium-Abonnement sofort und vor Ablauf der 14-tägigen Widerrufsfrist beginnt. Mir ist bekannt, dass ich mein Widerrufsrecht mit der vollständigen Erfüllung des Vertrags verliere.",
  en:
    "I expressly request that VELVET begin the Premium subscription immediately, before the 14-day withdrawal period ends. I am aware that I lose my right of withdrawal once the contract has been fully performed.",
  pl:
    "Wyraźnie żądam, aby VELVET rozpoczął świadczenie abonamentu Premium natychmiast, przed upływem 14-dniowego terminu odstąpienia od umowy. Przyjmuję do wiadomości, że wraz z pełnym wykonaniem umowy tracę prawo odstąpienia.",
  es:
    "Solicito expresamente que VELVET comience la suscripción Premium de inmediato, antes de que finalice el plazo de desistimiento de 14 días. Soy consciente de que pierdo mi derecho de desistimiento una vez ejecutado íntegramente el contrato.",
};
