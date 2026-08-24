import type { NextFunction, Request, Response } from "express";

export type Locale = "de" | "en";

export const DEFAULT_LOCALE: Locale = "de";

declare global {
  namespace Express {
    interface Request {
      locale: Locale;
    }
  }
}

// One entry per user-facing string. Adding a key here forces both `de` and
// `en` below to provide it -- TypeScript errors if either is missing one.
interface Translations {
  "auth.notAuthenticated": string;
  "auth.invalidToken": string;
  "auth.guestOnly": string;
  "auth.staffOnly": string;
  "auth.managerOnly": string;
  "auth.platformAdminOnly": string;
  "auth.emailAlreadyRegistered": string;
  "auth.verificationSent": string;
  "auth.wrongCredentials": string;
  "auth.emailNotVerified": string;
  "auth.linkInvalidOrExpired": string;
  "auth.staffNoVenue": string;
  "auth.invalidTokenType": string;
  "auth.noVenueAccess": string;
  "auth.tooManyRequests": string;

  "qr.photoRequired": string;
  "qr.codeInvalidOrExpired": string;
  "qr.guestNotFound": string;
  "qr.venueNotVerified": string;
  "qr.entryLogNotFound": string;

  "messages.notEligiblePeer": string;
  "messages.noExistingStaffContact": string;
  "messages.cannotBlockSelf": string;
  "messages.notFound": string;
  "messages.notEligibleStaff": string;

  "subscriptions.checkoutFailed": string;
  "subscriptions.noActiveSubscription": string;

  "users.notFound": string;
  "users.uploadFailed": string;
  "users.noImageProvided": string;
  "users.photoRequirementsNotMet": string;
  "users.invalidImageType": string;

  "venues.noChangesProvided": string;
  "venues.emailAlreadyTaken": string;

  "admin.venueNotFound": string;

  "invites.codeNotFound": string;
  "invites.cannotUseOwnCode": string;
  "invites.requestNotFound": string;

  "photo.tooSmall": string;
  "photo.tooDark": string;
  "photo.lowContrast": string;

  "mail.passwordReset.subject": string;
  "mail.passwordReset.text": string;
  "mail.passwordReset.intro": string;
  "mail.passwordReset.cta": string;
  "mail.passwordReset.disclaimer": string;
  "mail.verification.subject": string;
  "mail.verification.text": string;
  "mail.verification.intro": string;
  "mail.verification.cta": string;
  "mail.verification.disclaimer": string;
  "mail.relay.subject": string;
  "mail.relay.wroteYou": string;
  "mail.relay.wroteYouPlain": string;
  "mail.relay.replyHint": string;
}

const de: Translations = {
  "auth.notAuthenticated": "Nicht authentifiziert",
  "auth.invalidToken": "Ungültiges oder abgelaufenes Token",
  "auth.guestOnly": "Nur für Gast-Accounts",
  "auth.staffOnly": "Nur für Staff-Accounts",
  "auth.managerOnly": "Nur für Manager",
  "auth.platformAdminOnly": "Nur für Platform-Admins",
  "auth.emailAlreadyRegistered": "E-Mail bereits registriert",
  "auth.verificationSent": "Bitte bestätige deine E-Mail-Adresse über den Link, den wir dir geschickt haben.",
  "auth.wrongCredentials": "E-Mail oder Passwort falsch",
  "auth.emailNotVerified": "E-Mail-Adresse noch nicht bestätigt",
  "auth.linkInvalidOrExpired": "Link ist ungültig oder abgelaufen",
  "auth.staffNoVenue": "Account ist keiner Location zugeordnet",
  "auth.invalidTokenType": "Ungültiger Token-Typ",
  "auth.noVenueAccess": "Kein Zugriff auf diese Location",
  "auth.tooManyRequests": "Zu viele Versuche. Bitte später erneut versuchen.",

  "qr.photoRequired": "Bitte lade zuerst ein Profilfoto hoch",
  "qr.codeInvalidOrExpired": "Code ist ungültig oder abgelaufen",
  "qr.guestNotFound": "Gast nicht gefunden",
  "qr.venueNotVerified": "Location noch nicht freigegeben",
  "qr.entryLogNotFound": "Einlass-Eintrag nicht gefunden",

  "messages.notEligiblePeer": "Nachricht nicht möglich — kein gemeinsamer Location-Besuch als Premium-Mitglieder",
  "messages.noExistingStaffContact": "Kein bestehender Kontakt mit diesem Team",
  "messages.cannotBlockSelf": "Kann sich nicht selbst blockieren",
  "messages.notFound": "Nachricht nicht gefunden",
  "messages.notEligibleStaff": "Nachricht nicht möglich — kein VIP/Premium-Gast dieser Location",

  "subscriptions.checkoutFailed": "Checkout konnte nicht gestartet werden",
  "subscriptions.noActiveSubscription": "Kein aktives Abo gefunden",

  "users.notFound": "Nicht gefunden",
  "users.uploadFailed": "Upload fehlgeschlagen",
  "users.noImageProvided": "Kein Bild übermittelt",
  "users.photoRequirementsNotMet": "Foto erfüllt die Anforderungen nicht",
  "users.invalidImageType": "Nur JPEG, PNG oder WebP erlaubt",

  "venues.noChangesProvided": "Keine Änderungen übergeben",
  "venues.emailAlreadyTaken": "E-Mail bereits vergeben",

  "admin.venueNotFound": "Location nicht gefunden",

  "invites.codeNotFound": "Einladungscode nicht gefunden",
  "invites.cannotUseOwnCode": "Eigenen Einladungscode kann man nicht verwenden",
  "invites.requestNotFound": "Anfrage nicht gefunden",

  "photo.tooSmall": "Bild zu klein (mindestens {min}×{min}px erforderlich)",
  "photo.tooDark": "Bild zu dunkel — bitte an einem helleren Ort neu aufnehmen",
  "photo.lowContrast": "Bild zu flau/unscharf — bitte ein klareres Foto hochladen",

  "mail.passwordReset.subject": "VELVET — Passwort zurücksetzen",
  "mail.passwordReset.text":
    "Setze dein Passwort über diesen Link zurück (gültig für 1 Stunde):\n\n{resetUrl}\n\nWenn du das nicht angefordert hast, ignoriere diese E-Mail.",
  "mail.passwordReset.intro": "Setze dein Passwort über den folgenden Link zurück. Der Link ist 1 Stunde gültig.",
  "mail.passwordReset.cta": "Passwort zurücksetzen",
  "mail.passwordReset.disclaimer": "Wenn du das nicht angefordert hast, kannst du diese E-Mail einfach ignorieren.",
  "mail.verification.subject": "VELVET — E-Mail-Adresse bestätigen",
  "mail.verification.text":
    "Willkommen bei VELVET! Bestätige deine E-Mail-Adresse über diesen Link (gültig für 24 Stunden):\n\n{verifyUrl}\n\nErst danach kannst du dich einloggen. Wenn du dich nicht registriert hast, ignoriere diese E-Mail.",
  "mail.verification.intro":
    "Willkommen bei VELVET! Bestätige deine E-Mail-Adresse über den folgenden Link, bevor du dich einloggen kannst. Der Link ist 24 Stunden gültig.",
  "mail.verification.cta": "E-Mail-Adresse bestätigen",
  "mail.verification.disclaimer": "Wenn du dich nicht registriert hast, kannst du diese E-Mail einfach ignorieren.",
  "mail.relay.subject": "Neue Nachricht von {name} auf VELVET",
  "mail.relay.wroteYou": "hat dir auf VELVET geschrieben:",
  "mail.relay.wroteYouPlain": "hat dir auf VELVET geschrieben:",
  "mail.relay.replyHint": "Antworte einfach auf diese E-Mail, um direkt zu antworten — oder logg dich in der VELVET-App ein.",
};

const en: Translations = {
  "auth.notAuthenticated": "Not authenticated",
  "auth.invalidToken": "Invalid or expired token",
  "auth.guestOnly": "Guest accounts only",
  "auth.staffOnly": "Staff accounts only",
  "auth.managerOnly": "Managers only",
  "auth.platformAdminOnly": "Platform admins only",
  "auth.emailAlreadyRegistered": "Email already registered",
  "auth.verificationSent": "Almost done! Confirm your email address using the link we just sent you.",
  "auth.wrongCredentials": "Wrong email or password",
  "auth.emailNotVerified": "Email address not yet verified",
  "auth.linkInvalidOrExpired": "This link is invalid or has expired",
  "auth.staffNoVenue": "Account isn't assigned to any venue",
  "auth.invalidTokenType": "Invalid token type",
  "auth.noVenueAccess": "No access to this venue",
  "auth.tooManyRequests": "Too many attempts. Please try again later.",

  "qr.photoRequired": "Please upload a profile photo first",
  "qr.codeInvalidOrExpired": "Code is invalid or has expired",
  "qr.guestNotFound": "Guest not found",
  "qr.venueNotVerified": "Venue not yet approved",
  "qr.entryLogNotFound": "Entry log not found",

  "messages.notEligiblePeer": "Can't message — no shared venue visit as Premium members",
  "messages.noExistingStaffContact": "No existing contact with this team",
  "messages.cannotBlockSelf": "You can't block yourself",
  "messages.notFound": "Message not found",
  "messages.notEligibleStaff": "Can't message — not a VIP/Premium guest of this venue",

  "subscriptions.checkoutFailed": "Couldn't start checkout",
  "subscriptions.noActiveSubscription": "No active subscription found",

  "users.notFound": "Not found",
  "users.uploadFailed": "Upload failed",
  "users.noImageProvided": "No image provided",
  "users.photoRequirementsNotMet": "Photo doesn't meet the requirements",
  "users.invalidImageType": "Only JPEG, PNG, or WebP allowed",

  "venues.noChangesProvided": "No changes provided",
  "venues.emailAlreadyTaken": "Email already taken",

  "admin.venueNotFound": "Venue not found",

  "invites.codeNotFound": "Invite code not found",
  "invites.cannotUseOwnCode": "You can't use your own invite code",
  "invites.requestNotFound": "Request not found",

  "photo.tooSmall": "Image too small (minimum {min}×{min}px required)",
  "photo.tooDark": "Image too dark — please retake it somewhere brighter",
  "photo.lowContrast": "Image too flat/blurry — please upload a clearer photo",

  "mail.passwordReset.subject": "VELVET — Reset your password",
  "mail.passwordReset.text":
    "Reset your password using this link (valid for 1 hour):\n\n{resetUrl}\n\nIf you didn't request this, just ignore this email.",
  "mail.passwordReset.intro": "Reset your password using the link below. It's valid for 1 hour.",
  "mail.passwordReset.cta": "Reset password",
  "mail.passwordReset.disclaimer": "If you didn't request this, you can safely ignore this email.",
  "mail.verification.subject": "VELVET — Confirm your email address",
  "mail.verification.text":
    "Welcome to VELVET! Confirm your email address using this link (valid for 24 hours):\n\n{verifyUrl}\n\nYou'll need to do this before you can log in. If you didn't sign up, just ignore this email.",
  "mail.verification.intro":
    "Welcome to VELVET! Confirm your email address using the link below before you can log in. It's valid for 24 hours.",
  "mail.verification.cta": "Confirm email address",
  "mail.verification.disclaimer": "If you didn't sign up, you can safely ignore this email.",
  "mail.relay.subject": "New message from {name} on VELVET",
  "mail.relay.wroteYou": "sent you a message on VELVET:",
  "mail.relay.wroteYouPlain": "sent you a message on VELVET:",
  "mail.relay.replyHint": "Just reply to this email to respond directly — or sign in to the VELVET app.",
};

const dictionaries: Record<Locale, Translations> = { de, en };

export function t(locale: Locale, key: keyof Translations, params?: Record<string, string | number>): string {
  let str = dictionaries[locale][key];
  if (params) {
    for (const [name, value] of Object.entries(params)) {
      str = str.split(`{${name}}`).join(String(value));
    }
  }
  return str;
}

export function parseLocale(acceptLanguageHeader: string | undefined): Locale {
  if (!acceptLanguageHeader) return DEFAULT_LOCALE;
  const primary = acceptLanguageHeader.split(",")[0]?.trim().toLowerCase();
  return primary?.startsWith("en") ? "en" : DEFAULT_LOCALE;
}

// Clients opt into English via a normal `Accept-Language: en` header; anything
// else (including no header at all) stays on the German default.
export function localeMiddleware(req: Request, _res: Response, next: NextFunction) {
  req.locale = parseLocale(req.headers["accept-language"]);
  next();
}
