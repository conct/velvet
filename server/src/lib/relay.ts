import { prisma } from "../db";
import { getOrCreateInviteCode } from "./invite-code";
import { sendRelayMessageMail } from "./mailer";

// The domain the personalized email-relay addresses live under. Configurable
// so a future account move doesn't require a code change, same reasoning as
// the mail/API domains already being env-driven elsewhere.
export const RELAY_DOMAIN = process.env.RELAY_DOMAIN ?? "velvet-network.app";

// Every user's invite code doubles as the local-part of their personal
// <code>@velvet-network.app relay address -- reusing it (rather than a
// separate code) means there's only one opaque identifier per user to reason
// about, and rotating the invite code (POST /invites/me/rotate) naturally
// also rotates the relay address, invalidating old email threads the same
// way it invalidates old invite links.
export async function relayAddressFor(userId: string): Promise<string> {
  const invite = await getOrCreateInviteCode(userId);
  return `${invite.code}@${RELAY_DOMAIN}`;
}

// Local-part of a `<code>@velvet-network.app` address, or null if the
// address isn't at our relay domain at all.
export function extractRelayCode(address: string): string | null {
  const at = address.lastIndexOf("@");
  if (at === -1) return null;
  const domain = address.slice(at + 1).toLowerCase();
  if (domain !== RELAY_DOMAIN.toLowerCase()) return null;
  return address.slice(0, at);
}

// Abuse cap on the email side only -- the in-app message this mirrors
// already went through regardless of this function's outcome. Messaging
// itself is already gated by canMessage() (mutual verified check-in +
// Premium) or canStaffMessage() (VIP/Premium guest of your own venue), so
// this isn't the primary defense, just a backstop against one runaway
// sender (or a compromised/looping reply chain) flooding a real inbox.
const RELAY_MAIL_HOURLY_LIMIT = 20;

async function withinRateLimit(senderId: string | null, externalSenderEmail: string | null): Promise<boolean> {
  if (senderId) {
    const count = await prisma.message.count({
      where: { senderId, createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) } },
    });
    return count <= RELAY_MAIL_HOURLY_LIMIT;
  }
  if (externalSenderEmail) {
    const count = await prisma.message.count({
      where: { externalSenderEmail, createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) } },
    });
    return count <= RELAY_MAIL_HOURLY_LIMIT;
  }
  return true;
}

// Sends a real email to `recipientId`'s registered address mirroring a
// message that was just created in-app (or just parsed in from the relay
// watcher). Used from both directions: a normal in-app send mirrors out to
// the recipient's inbox, and an inbound relay reply re-mirrors the resulting
// Message back out to whichever side isn't the one who just emailed in --
// keeping both participants current even if one of them only ever uses email.
export async function mirrorMessageAsEmail(opts: {
  recipientId: string;
  senderId?: string | null;
  externalSenderEmail?: string | null;
  externalSenderName?: string | null;
  body: string;
}) {
  try {
    if (!(await withinRateLimit(opts.senderId ?? null, opts.externalSenderEmail ?? null))) return;

    const recipient = await prisma.user.findUnique({ where: { id: opts.recipientId }, select: { email: true } });
    if (!recipient) return;

    let replyToAddress: string;
    let senderCode: string | null = null;
    let senderName: string;
    if (opts.senderId) {
      const sender = await prisma.user.findUnique({ where: { id: opts.senderId }, select: { firstName: true } });
      if (!sender) return;
      replyToAddress = await relayAddressFor(opts.senderId);
      senderCode = extractRelayCode(replyToAddress);
      senderName = sender.firstName;
    } else if (opts.externalSenderEmail) {
      // No VELVET identity to route through -- reply goes straight back to
      // whoever actually sent it, same as any other forwarded email would.
      replyToAddress = opts.externalSenderEmail;
      senderName = opts.externalSenderName ?? opts.externalSenderEmail;
    } else {
      return;
    }

    await sendRelayMessageMail({
      to: recipient.email,
      replyToAddress,
      senderCode,
      senderName,
      bodyText: opts.body,
      locale: "de",
    });
  } catch (err) {
    console.error("Failed to mirror message as relay email", err);
  }
}
