"use client";

import Link from "next/link";
import { useLocale } from "../lib/locale-context";
import { availableDownloadSources } from "../lib/app-downloads";

// Deliberately German-only, like the Impressum and the Datenschutzerklärung
// (packages/shared/src/legal.ts) this page summarises. Translating a
// plain-language summary into four languages while the document it points at
// exists only in German would promise more than it delivers -- so only the
// chrome (the back link) comes from the translation table.
//
// Not in the sitemap and noindex on purpose: it is handed out by venues via
// /werbematerial, not something we want ranking against the real privacy
// policy.

const SOURCE_LABELS: Record<string, { name: string; what: string }> = {
  ios: { name: "App Store", what: "Für iPhone und iPad." },
  android: { name: "Google Play", what: "Für Android-Geräte." },
  apk: { name: "APK auf Anfrage", what: "Ohne Play Store — schreib an mail@velvet-network.app" },
  web: { name: "Im Browser öffnen", what: "Ohne Installation, funktioniert auf jedem Handy." },
};

const STEPS = [
  {
    title: "Profil anlegen",
    body: "E-Mail, Name und ein Profilfoto. Das Foto braucht es, damit das Personal an der Tür abgleichen kann, dass der Code zu dir gehört.",
  },
  {
    title: "QR-Code zeigen",
    body: "Beim Einlass erzeugt die App einen Code, der 90 Sekunden gilt und genau einmal funktioniert. Er wird gescannt, mehr passiert nicht.",
  },
  {
    title: "Der Abend wird bewertet",
    body: "Das Türpersonal vergibt Sterne und Merkmale wie „Freundlich“ oder „Ärger gemacht“.",
  },
  {
    title: "Dein Status wächst",
    body: "Aus allen Bewertungen entsteht ein Status von Beobachtung über Standard und Vertraut bis VIP — und im Ernstfall Gesperrt.",
  },
];

const STORED = [
  ["Anmeldedaten", "E-Mail, Vor- und Nachname. Dein Passwort wird nur als Hash gespeichert und ist im Klartext für niemanden einsehbar, auch nicht für uns."],
  ["Profilfoto", "freiwillig hochgeladen, dient der Identifikation am Einlass."],
  ["Bewertungen und Status", "Sterne, Merkmale und der daraus errechnete Score."],
  ["Einlass-Historie", "wann du an welcher Location gescannt wurdest."],
  ["Interne Notizen", "standortbezogene Vermerke des Personals. Diese sind für Gäste nicht einsehbar."],
  ["Abo-Status", "bei Premium — Laufzeit und Zahlungsanbieter, nicht die Zahlungsdaten selbst."],
  ["Private Nachrichten", "zwischen Premium-Mitgliedern."],
];

const NOT_DONE = [
  "Keine Zahlungsdaten. Kartennummern und PayPal-Zugänge liegen ausschließlich bei Stripe bzw. PayPal — wir sehen nur, ob ein Abo läuft und bis wann.",
  "Keine Tracking- oder Werbe-Cookies. Gespeichert wird nur, dass du angemeldet bist.",
  "Keine Weitergabe an Dritte außerhalb des Standortnetzwerks.",
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h2 className="font-heading text-2xl text-text">{children}</h2>
      <div className="mb-6 mt-1 h-px bg-gradient-to-r from-gold-muted via-border to-transparent" />
    </>
  );
}

export function GuestInfoClient() {
  const { t } = useLocale();
  const sources = availableDownloadSources();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:px-10">
      <Link href="/werbematerial" className="text-sm text-gold hover:text-gold-bright">
        ← {t.legal.back}
      </Link>

      <header className="mt-8">
        <p className="text-xs uppercase tracking-[0.18em] text-gold-muted">Für Gäste</p>
        <h1 className="mt-2 font-heading text-4xl leading-tight text-text">Was VELVET über dich weiß</h1>
        <p className="mt-4 text-base leading-relaxed text-text-muted">
          VELVET ist ein gemeinsames Vertrauensnetzwerk für den Türstand. Das funktioniert nur, wenn
          klar ist, was gespeichert wird und wer es sieht. Hier steht beides — ohne Kleingedrucktes.
        </p>
      </header>

      <section className="mt-14">
        <SectionHeading>Die Idee</SectionHeading>
        <p className="text-sm leading-relaxed text-text">
          Wer sich an der Tür anständig verhält, fängt beim nächsten Club nicht wieder bei null an.
          Dein Verhalten baut einen Status auf, den teilnehmende Locations sehen — und der dir dort
          einen leichteren Einlass verschafft, wo man dich noch nicht kennt.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          Dieselbe Mechanik wirkt in die andere Richtung: Wer an einer Tür Ärger macht, bringt das
          mit an die nächste. Das ist kein Nebeneffekt, sondern der Zweck.
        </p>
      </section>

      <section className="mt-14">
        <SectionHeading>So läuft ein Abend</SectionHeading>
        <ol className="flex flex-col gap-5">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold-muted text-xs text-gold">
                {i + 1}
              </span>
              <span>
                <span className="block text-sm font-semibold text-text">{step.title}</span>
                <span className="mt-0.5 block text-sm leading-relaxed text-text-muted">{step.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <SectionHeading>Deine Daten</SectionHeading>

        <div className="rounded-2xl border border-gold-muted bg-surface-raised p-6">
          <span className="text-xs uppercase tracking-[0.16em] text-gold">Das Wichtigste zuerst</span>
          <p className="mt-3 text-sm leading-relaxed text-text">
            Dein Profilfoto, dein Status und dein Bewertungsverlauf sind für Türpersonal, Security
            und Management <b className="font-semibold">aller teilnehmenden Locations</b> einsehbar —
            nicht nur der zuletzt besuchten. Ein an einer Tür ausgesprochenes Hausverbot ist an jeder
            anderen Tür im Netzwerk sichtbar. Das ist die Kernfunktion von VELVET, und du solltest
            sie kennen, bevor du dich anmeldest.
          </p>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-text-muted">
          Weitergegeben wird darüber hinaus nichts: Außerhalb des Netzwerks teilnehmender Locations
          bekommt niemand deine Daten.
        </p>

        <h3 className="mt-8 text-sm font-semibold text-gold-bright">Was gespeichert wird</h3>
        <ul className="mt-3 flex flex-col gap-2.5">
          {STORED.map(([label, body]) => (
            <li key={label} className="flex gap-3 text-sm leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-muted" />
              <span className="text-text-muted">
                <b className="font-semibold text-text">{label}</b> — {body}
              </span>
            </li>
          ))}
        </ul>

        <h3 className="mt-8 text-sm font-semibold text-gold-bright">Was VELVET nicht macht</h3>
        <ul className="mt-3 flex flex-col gap-2.5">
          {NOT_DONE.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-success" />
              <span className="text-text-muted">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
          <h3 className="text-sm font-semibold text-gold-bright">
            Nachrichten sind an einen gemeinsamen Abend geknüpft
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Premium-Mitglieder können sich nur schreiben, wenn sie nachweislich am selben Abend in
            derselben Location eingecheckt waren. Ohne diese verifizierte gemeinsame Anwesenheit gibt
            es keinen Nachrichtenkontakt — niemand kann dich einfach so anschreiben.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            Inhalte sind ausschließlich für die beiden Beteiligten sichtbar. Du kannst jederzeit
            blockieren oder eine Nachricht melden. Gemeldete Inhalte werden zur Prüfung aufbewahrt,
            und der Betreiber kann im Einzelfall darauf zugreifen, um einen gemeldeten Verstoß
            aufzuklären.
          </p>
        </div>

        <h3 className="mt-8 text-sm font-semibold text-gold-bright">Locations ausblenden</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          Du kannst jede besuchte Location dauerhaft aus deiner Historie nehmen — direkt in der App.
          Sie verschwindet dann aus deiner Liste, und niemand kann dich über sie in den
          Premium-Kontakten finden. Rückgängig machen kann das nur der Support, auf deine Anfrage
          hin. Deine Bewertungen von dort zählen weiter für deinen Status, und die Location behält
          ihre eigenen Aufzeichnungen.
        </p>

        <h3 className="mt-8 text-sm font-semibold text-gold-bright">
          Wo die Daten liegen, und wie lange
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          VELVET läuft bei einem Hosting-Anbieter mit Serverstandort Deutschland. Deine Daten bleiben
          gespeichert, solange dein Konto besteht. Löschst du es, werden sie entfernt, soweit keine
          gesetzlichen Aufbewahrungspflichten entgegenstehen.
        </p>

        <h3 className="mt-8 text-sm font-semibold text-gold-bright">Deine Rechte</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
          Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO) — und das Recht, dich bei der
          zuständigen Datenschutzaufsichtsbehörde zu beschweren. Für alles davon genügt eine Mail an{" "}
          <a href="mailto:mail@velvet-network.app" className="text-gold hover:text-gold-bright">
            mail@velvet-network.app
          </a>
          .
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          Dein Konto löschen kannst du selbst, jederzeit, unter{" "}
          <Link href="/konto-loeschen" className="text-gold hover:text-gold-bright">
            velvet-network.app/konto-loeschen
          </Link>
          .
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          Die vollständige Fassung mit allen Rechtsgrundlagen steht in der{" "}
          <Link href="/datenschutz" className="text-gold hover:text-gold-bright">
            Datenschutzerklärung
          </Link>
          . Diese Seite fasst sie zusammen und ersetzt sie nicht.
        </p>
      </section>

      <section className="mt-14">
        <SectionHeading>Für Locations</SectionHeading>
        <p className="text-sm leading-relaxed text-text">
          Clubs, Bars und Kneipen können sich selbst anmelden — unter{" "}
          <Link href="/location-anmelden" className="text-gold hover:text-gold-bright">
            velvet-network.app/location-anmelden
          </Link>
          .
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          Freigeschaltet wird niemand automatisch. Zur Anmeldung gehört eine Gewerbeanmeldung, die
          von Hand geprüft wird; erst danach entsteht der Zugang. Das ist der Grund, warum
          Gästeprofile überhaupt sichtbar gemacht werden können: Es sind nachweislich echte Betriebe
          dahinter, keine anonymen Accounts.
        </p>
      </section>

      <section className="mt-14">
        <SectionHeading>App holen</SectionHeading>
        <div className="grid gap-3 sm:grid-cols-2">
          {sources.map((source) => {
            const label = SOURCE_LABELS[source.key];
            const inner = (
              <>
                <span className="block text-sm font-medium text-text">{label.name}</span>
                <span className="mt-0.5 block text-xs text-text-muted">{label.what}</span>
              </>
            );
            return source.isMail ? (
              <div key={source.key} className="rounded-2xl border border-border bg-surface px-5 py-4">
                {inner}
              </div>
            ) : (
              <a
                key={source.key}
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-border bg-surface px-5 py-4 transition hover:border-gold/60 hover:bg-surface-raised"
              >
                {inner}
              </a>
            );
          })}
        </div>
      </section>

      <footer className="mt-16 flex flex-col gap-2 border-t border-border pt-6 text-xs text-text-muted">
        <span>
          Fragen, Auskunft, Löschung:{" "}
          <a href="mailto:mail@velvet-network.app" className="text-gold hover:text-gold-bright">
            mail@velvet-network.app
          </a>
        </span>
        <span className="flex flex-wrap gap-4">
          <Link href="/datenschutz" className="hover:text-text">
            Datenschutzerklärung
          </Link>
          <Link href="/impressum" className="hover:text-text">
            Impressum
          </Link>
        </span>
      </footer>
    </div>
  );
}
