// Mindestalter für ein Gäste-Konto. Die Gäste-AGB (§ 2, guest-terms.ts)
// setzen Volljährigkeit voraus; erfasst und geprüft wird sie über das
// Geburtsdatum, nicht über eine bloße Bestätigungs-Checkbox — nur so ist
// später nachweisbar, welche Angabe eine Person bei der Registrierung
// gemacht hat.
export const MIN_SIGNUP_AGE = 18;

/**
 * Alter in vollen Jahren an einem Stichtag. Rein kalendarisch gerechnet,
 * ohne Zeitzonen-Anteil: `dateOfBirth` ist ein Datum, keine Uhrzeit.
 */
export function ageOnDate(dateOfBirth: Date, at: Date = new Date()): number {
  let age = at.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = at.getMonth() - dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && at.getDate() < dateOfBirth.getDate())) age -= 1;
  return age;
}

/**
 * Parst ein Datum in der Form `YYYY-MM-DD` — das Format, in dem das
 * Geburtsdatum zwischen App und API übertragen wird. Gibt `null` zurück,
 * wenn die Zeichenkette kein gültiges Kalenderdatum ist (z. B. 31.02.).
 */
export function parseIsoDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  const roundTrips =
    date.getUTCFullYear() === Number(year) &&
    date.getUTCMonth() === Number(month) - 1 &&
    date.getUTCDate() === Number(day);
  return roundTrips ? date : null;
}

/**
 * Prüft ein Geburtsdatum für die Registrierung: gültiges Datum, nicht in
 * der Zukunft, mindestens `MIN_SIGNUP_AGE` Jahre alt und nicht absurd weit
 * in der Vergangenheit (fängt Zahlendreher wie 1092 ab).
 */
export function checkSignupDateOfBirth(
  value: string,
  now: Date = new Date()
): { ok: true; date: Date } | { ok: false; reason: "invalid" | "underage" } {
  const date = parseIsoDate(value);
  if (!date) return { ok: false, reason: "invalid" };

  const age = ageOnDate(date, now);
  if (age < 0 || age > 120) return { ok: false, reason: "invalid" };
  if (age < MIN_SIGNUP_AGE) return { ok: false, reason: "underage" };
  return { ok: true, date };
}
