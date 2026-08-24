import crypto from "crypto";
import { prisma } from "../db";

function generateInviteCode(): string {
  return crypto.randomBytes(6).toString("base64url");
}

// Shared by routes/invites.ts (user-facing invite codes) and lib/relay.ts
// (the same code doubles as the local-part of a user's personalized
// <code>@velvet-network.app email-relay address).
export async function getOrCreateInviteCode(userId: string) {
  const existing = await prisma.userInviteCode.findUnique({ where: { userId } });
  if (existing) return existing;

  // Extremely unlikely to collide (base64url of 6 random bytes), but retry
  // on the off chance rather than letting a unique-constraint error bubble up.
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await prisma.userInviteCode.create({ data: { userId, code: generateInviteCode() } });
    } catch {
      continue;
    }
  }
  throw new Error("Could not generate a unique invite code");
}
