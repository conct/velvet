import nodemailer from "nodemailer";
import MailComposer from "nodemailer/lib/mail-composer";
import { ImapFlow } from "imapflow";
import { t, type Locale } from "./i18n";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) return null;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

const THEME = {
  background: "#0B0B0C",
  surface: "#161616",
  border: "#2A2620",
  gold: "#D4AF37",
  text: "#F5F1E8",
  textMuted: "#A79F8E",
};
const FONT_HEADING = "Georgia, 'Times New Roman', serif";
const FONT_BODY = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// A 128x128 re-render of the VELVET monogram: Playfair Display "V" + thin
// ring, drawn directly onto THEME.surface via SVG (see the generation
// snippet this was produced with -- embeds the actual PlayfairDisplay_700Bold
// ttf as a data-URI @font-face, 4x supersampled then downscaled for crisp
// edges). Two earlier attempts derived this from app/icon.png's raster
// artwork instead -- both left a visibly different-colored patch behind the
// mark in a real client: the opaque version because icon.png's own
// background isn't quite THEME.surface, and a transparent version because
// icon.png's radial glow has non-trivial luminosity even in its "background"
// pixels, so keying transparency by luminosity kept a faint haze instead of
// dropping to nothing. Drawing the mark flat from scratch has no gradient to
// leak through, so it doesn't have this problem. Embedded as a CID
// attachment (see sendAndArchive) rather than a remote https://.../icon.png
// reference so it always renders immediately, without the recipient needing
// to click "show images".
const LOGO_CID = "velvet-logo";
const LOGO_BUFFER = Buffer.from(
  "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",
  "base64"
);

// Wraps translated inner content (see i18n.ts's mail.* keys) in VELVET's dark,
// gold-accented look -- table-based layout and inline styles throughout since
// that's what actually survives Outlook/Gmail/etc, not flexbox or a <style>
// block.
function wrapBrandedEmail(innerHtml: string): string {
  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:${THEME.background};font-family:${FONT_BODY};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${THEME.background};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:${THEME.surface};border:1px solid ${THEME.border};border-radius:16px;overflow:hidden;">
            <tr>
              <td align="center" style="padding:32px 32px 8px;">
                <img src="cid:${LOGO_CID}" width="56" height="56" alt="VELVET" style="display:block;" />
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:0 32px 24px;">
                <span style="font-family:${FONT_HEADING};color:${THEME.gold};font-size:22px;letter-spacing:2px;">VELVET</span>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;color:${THEME.text};font-size:15px;line-height:1.6;">
                ${innerHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

function renderButton(url: string, label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="border-radius:999px;background:${THEME.gold};">
          <a href="${url}" style="display:inline-block;padding:12px 28px;color:${THEME.background};font-family:${FONT_BODY};font-weight:600;font-size:14px;text-decoration:none;border-radius:999px;">${label}</a>
        </td>
      </tr>
    </table>
  `;
}

function renderFallbackLink(url: string): string {
  return `<p style="color:${THEME.textMuted};font-size:13px;word-break:break-all;">${url}</p>`;
}

function escapeHtml(input: string): string {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Free-text body (e.g. a newsletter) split on blank lines into paragraphs,
// wrapped in the same branded template as the transactional emails above.
// Plain text in, not raw HTML -- callers don't need to know the template's
// markup, and this keeps arbitrary staff-authored input from breaking the
// layout or injecting markup.
function renderCustomBody(bodyText: string): string {
  return bodyText
    .split(/\n{2,}/)
    .map((paragraph) => `<p style="margin:0 0 16px;color:${THEME.text};">${escapeHtml(paragraph).replace(/\n/g, "<br/>")}</p>`)
    .join("");
}

function buildMessage(input: ConstructorParameters<typeof MailComposer>[0]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    new MailComposer(input).compile().build((err, message) => {
      if (err) reject(err);
      else resolve(message);
    });
  });
}

// Appends a copy into the sending mailbox's own "Sent" folder over IMAP, so
// it shows up in a normal mail client the same way a manually-sent mail
// would (a BCC copy only lands in the Inbox, which doesn't sync the same way).
async function archiveInSentFolder(message: Buffer) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return;

  const client = new ImapFlow({
    host: process.env.SMTP_HOST,
    port: 993,
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    logger: false,
  });

  try {
    await client.connect();
    await client.append("Sent", message, ["\\Seen"]);
  } finally {
    await client.logout().catch(() => {});
  }
}

// Sends a transactional mail and, for documentation purposes, files a second,
// more informative copy (who requested it, which details, when) directly in
// the mailbox's Sent folder -- the mail actually delivered to the recipient
// stays a plain, minimal message.
async function sendAndArchive(opts: {
  to: string;
  subject: string;
  text: string;
  html: string;
  archiveLabel: string;
  archiveDetails: Record<string, string>;
}) {
  const transport = getTransporter();
  if (!transport) {
    console.warn(`SMTP not configured — ${opts.archiveLabel} link for ${opts.to} was not sent`);
    return;
  }

  const from = process.env.SMTP_FROM ?? "VELVET <mail@velvet-network.app>";
  await transport.sendMail({
    from,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
    attachments: [{ filename: "velvet-logo.png", content: LOGO_BUFFER, cid: LOGO_CID }],
  });

  try {
    const requestedAt = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });
    const details = { ...opts.archiveDetails, "Angefordert am": requestedAt };
    const archiveMessage = await buildMessage({
      from,
      to: opts.to,
      subject: `${opts.subject} — angefordert von ${opts.to}`,
      text: [
        `${opts.archiveLabel} wurde verschickt.`,
        "",
        ...Object.entries(details).map(([k, v]) => `${k}: ${v}`),
      ].join("\n"),
      html: `
        <p><b>${opts.archiveLabel} wurde verschickt.</b></p>
        <ul>
          ${Object.entries(details)
            .map(([k, v]) => `<li>${k}: ${v}</li>`)
            .join("\n")}
        </ul>
      `,
    });
    await archiveInSentFolder(archiveMessage);
  } catch (err) {
    console.error(`Failed to archive ${opts.archiveLabel} email in Sent folder`, err);
  }
}

export async function sendPasswordResetEmail(to: string, resetUrl: string, kind: "user" | "staff", locale: Locale) {
  const kindLabel = kind === "staff" ? "Staff (Türsteher/Manager)" : "Gast";

  const html = wrapBrandedEmail(`
    <p style="margin:0 0 4px;color:${THEME.text};">${t(locale, "mail.passwordReset.intro")}</p>
    ${renderButton(resetUrl, t(locale, "mail.passwordReset.cta"))}
    ${renderFallbackLink(resetUrl)}
    <p style="margin:24px 0 0;color:${THEME.textMuted};font-size:13px;">${t(locale, "mail.passwordReset.disclaimer")}</p>
  `);

  await sendAndArchive({
    to,
    subject: t(locale, "mail.passwordReset.subject"),
    text: t(locale, "mail.passwordReset.text", { resetUrl }),
    html,
    // The archive copy is filed for Daniel's own documentation, not the
    // recipient -- it always stays German regardless of the outbound locale.
    archiveLabel: "Passwort-Reset-Mail",
    archiveDetails: {
      "Konto-E-Mail": to,
      "Konto-Typ": kindLabel,
      "Gesendeter Link": resetUrl,
    },
  });
}

// General-purpose branded email for one-off/manual sends (e.g. a newsletter)
// -- same dark VELVET card as the transactional emails, but the subject and
// body are free text supplied by the caller instead of a fixed i18n key.
export async function sendCustomEmail(to: string, subject: string, bodyText: string) {
  const html = wrapBrandedEmail(renderCustomBody(bodyText));

  await sendAndArchive({
    to,
    subject,
    text: bodyText,
    html,
    archiveLabel: "Individuelle E-Mail",
    archiveDetails: { Empfänger: to, Betreff: subject },
  });
}

// Appends a message into a folder on the relay mailbox (RELAY_IMAP_*, a
// separate account from the transactional mail@ box) -- creating the folder
// first if it doesn't exist yet. Used to file both sides of a user's relay
// correspondence under a per-user folder named after their relay code, so
// deleting that one folder on account deletion removes all of it (see
// deleteRelayFolders below) without touching anyone else's mail.
async function appendToRelayFolder(mailboxPath: string, message: Buffer) {
  if (!process.env.RELAY_IMAP_HOST || !process.env.RELAY_IMAP_USER || !process.env.RELAY_IMAP_PASS) return;

  const client = new ImapFlow({
    host: process.env.RELAY_IMAP_HOST,
    port: 993,
    secure: true,
    auth: { user: process.env.RELAY_IMAP_USER, pass: process.env.RELAY_IMAP_PASS },
    logger: false,
  });

  try {
    await client.connect();
    await client.mailboxCreate(mailboxPath).catch(() => {});
    await client.append(mailboxPath, message, ["\\Seen"]);
  } finally {
    await client.logout().catch(() => {});
  }
}

// Deletes a user's entire relay correspondence (both the folder their
// inbound mail was filed under, and their outbound archive under Sent.<code>)
// -- called from the account-deletion route. Best-effort: a mailbox that was
// never created (e.g. this user never received or sent any relay mail) just
// fails to delete, which is fine and expected, not an error worth surfacing.
// Uses "." as the hierarchy separator, not "/" -- confirmed empirically via
// client.list()'s `delimiter` field for this specific mail server (Uberspace
// rejects APPEND/CREATE with a '/' path outright), not a universal IMAP rule.
export async function deleteRelayFolders(code: string) {
  if (!process.env.RELAY_IMAP_HOST || !process.env.RELAY_IMAP_USER || !process.env.RELAY_IMAP_PASS) return;

  const client = new ImapFlow({
    host: process.env.RELAY_IMAP_HOST,
    port: 993,
    secure: true,
    auth: { user: process.env.RELAY_IMAP_USER, pass: process.env.RELAY_IMAP_PASS },
    logger: false,
  });

  try {
    await client.connect();
    await client.mailboxDelete(code).catch(() => {});
    await client.mailboxDelete(`Sent.${code}`).catch(() => {});
  } catch (err) {
    console.error(`Failed to delete relay folders for code ${code}`, err);
  } finally {
    await client.logout().catch(() => {});
  }
}

// Mirrors an in-app message as a real email to the recipient's registered
// address, so a reply from their normal mail client loops back into the app
// via the IMAP relay watcher (see lib/relay.ts / relay-watcher.ts). The
// envelope From stays the fixed, authenticated mail@ box -- SPF/DKIM only
// align for that address, and Uberspace's SMTP would likely reject or flag a
// From: header for a different local-part anyway. Reply-To carries the
// sender's personal <code>@velvet-network.app relay address instead, so
// "Reply" in a normal mail client still routes back correctly without
// needing to spoof anything.
export async function sendRelayMessageMail(opts: {
  to: string;
  replyToAddress: string;
  senderCode?: string | null;
  senderName: string;
  bodyText: string;
  locale: Locale;
}) {
  const transport = getTransporter();
  if (!transport) {
    console.warn(`SMTP not configured — relay mail to ${opts.to} was not sent`);
    return;
  }

  const html = wrapBrandedEmail(`
    <p style="margin:0 0 12px;color:${THEME.text};"><b>${escapeHtml(opts.senderName)}</b> ${t(opts.locale, "mail.relay.wroteYou")}</p>
    ${renderCustomBody(opts.bodyText)}
    <p style="margin:24px 0 0;color:${THEME.textMuted};font-size:13px;">${t(opts.locale, "mail.relay.replyHint")}</p>
  `);

  const from = process.env.SMTP_FROM ?? "VELVET <mail@velvet-network.app>";
  const mailInput = {
    from,
    replyTo: `"${opts.senderName}" <${opts.replyToAddress}>`,
    to: opts.to,
    subject: t(opts.locale, "mail.relay.subject", { name: opts.senderName }),
    text: [`${opts.senderName} ${t(opts.locale, "mail.relay.wroteYouPlain")}`, "", opts.bodyText, "", t(opts.locale, "mail.relay.replyHint")].join(
      "\n"
    ),
    html,
    attachments: [{ filename: "velvet-logo.png", content: LOGO_BUFFER, cid: LOGO_CID }],
  };

  await transport.sendMail(mailInput);

  // Only VELVET-identified senders have a code/folder to file under -- an
  // external sender's outbound re-mirror (see lib/relay.ts) has nowhere of
  // their own to archive into, so it's skipped rather than invented.
  if (!opts.senderCode) return;
  try {
    const archiveMessage = await buildMessage(mailInput);
    await appendToRelayFolder(`Sent.${opts.senderCode}`, archiveMessage);
  } catch (err) {
    console.error(`Failed to archive relay mail in Sent.${opts.senderCode}`, err);
  }
}

export async function sendVerificationEmail(to: string, verifyUrl: string, locale: Locale) {
  const html = wrapBrandedEmail(`
    <p style="margin:0 0 4px;color:${THEME.text};">${t(locale, "mail.verification.intro")}</p>
    ${renderButton(verifyUrl, t(locale, "mail.verification.cta"))}
    ${renderFallbackLink(verifyUrl)}
    <p style="margin:24px 0 0;color:${THEME.textMuted};font-size:13px;">${t(locale, "mail.verification.disclaimer")}</p>
  `);

  await sendAndArchive({
    to,
    subject: t(locale, "mail.verification.subject"),
    text: t(locale, "mail.verification.text", { verifyUrl }),
    html,
    archiveLabel: "Bestätigungs-Mail",
    archiveDetails: {
      "Konto-E-Mail": to,
      "Gesendeter Link": verifyUrl,
    },
  });
}

// --- Self-service venue applications (see routes/venue-applications.ts) ---

export async function sendVenueApplicationReceivedEmail(to: string, venueName: string, locale: Locale) {
  const html = wrapBrandedEmail(`
    <p style="margin:0 0 16px;color:${THEME.text};">${t(locale, "mail.venueApplication.received.intro", { venueName: escapeHtml(venueName) })}</p>
    <p style="margin:0;color:${THEME.textMuted};font-size:14px;">${t(locale, "mail.venueApplication.received.body")}</p>
  `);

  await sendAndArchive({
    to,
    subject: t(locale, "mail.venueApplication.received.subject"),
    text: t(locale, "mail.venueApplication.received.text", { venueName }),
    html,
    archiveLabel: "Location-Bewerbung (Eingangsbestätigung)",
    archiveDetails: {
      "Kontakt-E-Mail": to,
      Location: venueName,
    },
  });
}

// Sent once a platform admin has checked the business registration and
// created the venue. Carries a password-set link rather than a generated
// password, so no plaintext credential is ever put in an email.
export async function sendVenueApplicationApprovedEmail(
  to: string,
  venueName: string,
  setPasswordUrl: string,
  locale: Locale
) {
  const html = wrapBrandedEmail(`
    <p style="margin:0 0 4px;color:${THEME.text};">${t(locale, "mail.venueApplication.approved.intro", { venueName: escapeHtml(venueName) })}</p>
    ${renderButton(setPasswordUrl, t(locale, "mail.venueApplication.approved.cta"))}
    ${renderFallbackLink(setPasswordUrl)}
    <p style="margin:24px 0 0;color:${THEME.textMuted};font-size:13px;">${t(locale, "mail.venueApplication.approved.disclaimer")}</p>
  `);

  await sendAndArchive({
    to,
    subject: t(locale, "mail.venueApplication.approved.subject", { venueName }),
    text: t(locale, "mail.venueApplication.approved.text", { venueName, setPasswordUrl }),
    html,
    archiveLabel: "Location-Bewerbung (Freigabe)",
    archiveDetails: {
      "Kontakt-E-Mail": to,
      Location: venueName,
      "Gesendeter Link": setPasswordUrl,
    },
  });
}

export async function sendVenueApplicationRejectedEmail(
  to: string,
  venueName: string,
  reason: string,
  locale: Locale
) {
  const html = wrapBrandedEmail(`
    <p style="margin:0 0 16px;color:${THEME.text};">${t(locale, "mail.venueApplication.rejected.intro", { venueName: escapeHtml(venueName) })}</p>
    <p style="margin:0 0 16px;color:${THEME.text};"><span style="color:${THEME.textMuted};">${t(locale, "mail.venueApplication.rejected.reasonLabel")}:</span> ${escapeHtml(reason)}</p>
    <p style="margin:0;color:${THEME.textMuted};font-size:13px;">${t(locale, "mail.venueApplication.rejected.outro")}</p>
  `);

  await sendAndArchive({
    to,
    subject: t(locale, "mail.venueApplication.rejected.subject"),
    text: t(locale, "mail.venueApplication.rejected.text", { venueName, reason }),
    html,
    archiveLabel: "Location-Bewerbung (Absage)",
    archiveDetails: {
      "Kontakt-E-Mail": to,
      Location: venueName,
      Grund: reason,
    },
  });
}
