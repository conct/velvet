// Standalone long-running process (own systemd service on U8, not part of
// the Express API) that watches the relay mailbox's catchall inbox and turns
// inbound mail into in-app Messages. See lib/relay.ts for the address
// scheme and the outbound half of this bridge.
import "dotenv/config";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { prisma } from "./db";
import { extractRelayCode, mirrorMessageAsEmail } from "./lib/relay";


const POLL_INTERVAL_MS = 20_000;
const MAX_BODY_LENGTH = 2000;

// Cuts a reply off at the first quoted-history marker so only the new text
// a person actually typed gets stored -- covers the common Gmail/Outlook/
// Apple Mail phrasings in both languages VELVET ships with server-side.
// Not exhaustive (clients vary endlessly), just enough that most replies
// come through clean; a client with an unrecognized quote style just ends
// up including its quoted history too, which is harmless, not corrupting.
function stripQuotedReply(text: string): string {
  const patterns = [
    /^On .+wrote:\s*$/m,
    /^Am .+schrieb .+:\s*$/m,
    /^-{2,}\s*Original Message\s*-{2,}/im,
    /^-{2,}\s*Ursprüngliche Nachricht\s*-{2,}/im,
    /^Von:\s.+$/m,
    /^From:\s.+$/m,
    /^Gesendet:\s.+$/m,
    /^Sent:\s.+$/m,
    /^>/m,
  ];
  let cut = text.length;
  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (match && match.index < cut) cut = match.index;
  }
  return text.slice(0, cut).trim();
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function addressesOf(field: unknown): string[] {
  if (!field || typeof field !== "object") return [];
  const values = "value" in (field as Record<string, unknown>) ? (field as { value: unknown }).value : field;
  if (!Array.isArray(values)) return [];
  return values.map((v) => (v as { address?: string }).address).filter((a): a is string => Boolean(a));
}

async function findRelayRecipient(toAddresses: string[]): Promise<string | null> {
  for (const address of toAddresses) {
    const code = extractRelayCode(address);
    if (!code) continue;
    const invite = await prisma.userInviteCode.findUnique({ where: { code } });
    if (invite) return invite.userId;
  }
  return null;
}

// Returns the relay code of the message's recipient (i.e. the folder its
// correspondence should be filed under) once successfully turned into a
// Message, or null if it couldn't be attributed to any known relay address
// and should just stay put, marked seen, in the flat INBOX.
async function processMessage(client: ImapFlow, uid: number): Promise<string | null> {
  const { content } = await client.download(String(uid), undefined, { uid: true });
  const parsed = await simpleParser(content);

  const toAddresses = addressesOf(parsed.to);
  const recipientUserId = await findRelayRecipient(toAddresses);
  if (!recipientUserId) {
    // Not addressed to any known relay code -- stray mail landing on the
    // catchall (misconfigured sender, spam probing random local-parts).
    // Nothing to do with it, just leave it in the mailbox unseen-marked.
    return null;
  }
  const recipientCode = extractRelayCode(toAddresses.find((a) => extractRelayCode(a)) ?? "");

  const fromEntry = parsed.from?.value?.[0];
  const fromAddress = fromEntry?.address?.toLowerCase();
  if (!fromAddress) return null;

  const matchedSender = await prisma.user.findUnique({ where: { email: fromAddress } });
  const senderId = matchedSender?.id ?? null;
  const externalSenderEmail = senderId ? null : fromAddress;
  const externalSenderName = senderId ? null : (fromEntry?.name || fromAddress);

  const rawText = parsed.text ?? (parsed.html ? stripHtml(parsed.html) : "");
  const body = stripQuotedReply(rawText).slice(0, MAX_BODY_LENGTH).trim();
  if (!body) return null;

  await prisma.message.create({
    data: {
      recipientId: recipientUserId,
      senderId,
      externalSenderEmail,
      externalSenderName,
      body,
      viaEmailRelay: true,
    },
  });

  // Bridges the reply back out so the recipient sees it even if they only
  // ever check email, not the app -- mirrors the same way a normal in-app
  // send does (see messages.ts's POST /thread/:userId).
  await mirrorMessageAsEmail({
    recipientId: recipientUserId,
    senderId,
    externalSenderEmail,
    externalSenderName,
    body,
  });

  return recipientCode;
}

async function pollOnce(client: ImapFlow) {
  const lock = await client.getMailboxLock("INBOX");
  try {
    const uids = await client.search({ seen: false }, { uid: true });
    for (const uid of uids || []) {
      let destinationFolder: string | null = null;
      try {
        destinationFolder = await processMessage(client, uid);
      } catch (err) {
        console.error(`relay-watcher: failed to process message uid=${uid}`, err);
      }

      try {
        if (destinationFolder) {
          // Files the processed message under the recipient's own folder
          // (created on first use) instead of leaving everything in one flat
          // INBOX -- lets deleteRelayFolders() wipe one user's correspondence
          // on account deletion without touching anyone else's.
          await client.mailboxCreate(destinationFolder).catch(() => {});
          await client.messageMove({ uid: String(uid) }, destinationFolder, { uid: true });
        } else {
          // Unattributable or failed message -- mark seen and leave it in
          // INBOX rather than retrying (and re-erroring on) it every poll.
          await client.messageFlagsAdd({ uid: String(uid) }, ["\\Seen"], { uid: true });
        }
      } catch (err) {
        console.error(`relay-watcher: failed to file/flag message uid=${uid}`, err);
      }
    }
  } finally {
    lock.release();
  }
}

async function main() {
  const host = process.env.RELAY_IMAP_HOST;
  const user = process.env.RELAY_IMAP_USER;
  const pass = process.env.RELAY_IMAP_PASS;
  if (!host || !user || !pass) {
    console.error("relay-watcher: RELAY_IMAP_HOST/RELAY_IMAP_USER/RELAY_IMAP_PASS not set, exiting");
    process.exit(1);
  }

  console.log(`relay-watcher: starting, polling ${user} every ${POLL_INTERVAL_MS / 1000}s`);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const client = new ImapFlow({
      host,
      port: 993,
      secure: true,
      auth: { user, pass },
      logger: false,
    });

    try {
      await client.connect();
      // eslint-disable-next-line no-constant-condition
      while (true) {
        await pollOnce(client);
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      }
    } catch (err) {
      console.error("relay-watcher: connection error, reconnecting in 30s", err);
      await new Promise((resolve) => setTimeout(resolve, 30_000));
    } finally {
      await client.logout().catch(() => {});
    }
  }
}

main();
