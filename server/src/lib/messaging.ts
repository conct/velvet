import { prisma } from "../db";
import { world, worldOf } from "./demo";
import { hiddenVenueIds } from "./hidden-venues";
import { isPremium } from "./premium";
import { getUserTrust } from "./trust";

// Same "night" = same venue, arrival times within a rolling window of each
// other. A fixed midnight cutoff would wrongly split one continuous night
// for guests who arrive hours apart at an event running ~9pm-4am+.
const SHARED_NIGHT_WINDOW_MS = 12 * 60 * 60 * 1000;

async function isBlocked(userIdA: string, userIdB: string): Promise<boolean> {
  const block = await prisma.blockedUser.findFirst({
    where: {
      OR: [
        { blockerId: userIdA, blockedId: userIdB },
        { blockerId: userIdB, blockedId: userIdA },
      ],
    },
  });
  return !!block;
}

function overlaps(
  entriesA: { venueId: string; scannedAt: Date }[],
  entriesB: { venueId: string; scannedAt: Date }[]
): boolean {
  return entriesA.some((a) =>
    entriesB.some(
      (b) =>
        a.venueId === b.venueId &&
        Math.abs(a.scannedAt.getTime() - b.scannedAt.getTime()) <= SHARED_NIGHT_WINDOW_MS
    )
  );
}

async function sharedNightExists(userIdA: string, userIdB: string): Promise<boolean> {
  // Both sides are filtered to A's world: a visit logged in the sandbox must
  // never make a real guest messageable, or the other way round.
  const filters = world(await worldOf(userIdA));

  const [entriesA, entriesB, hiddenA, hiddenB] = await Promise.all([
    prisma.entryLog.findMany({
      where: { userId: userIdA, ...filters.entry },
      select: { venueId: true, scannedAt: true },
    }),
    prisma.entryLog.findMany({
      where: { userId: userIdB, ...filters.entry },
      select: { venueId: true, scannedAt: true },
    }),
    hiddenVenueIds(userIdA),
    hiddenVenueIds(userIdB),
  ]);

  // A location either side has hidden stops being a reason to let them talk:
  // otherwise hiding it would be pointless, since the chat itself would still
  // announce they were both there.
  const visibleA = entriesA.filter((e) => !hiddenA.has(e.venueId));
  const visibleB = entriesB.filter((e) => !hiddenB.has(e.venueId));
  if (overlaps(visibleA, visibleB)) return true;

  // One exception: a conversation that already exists stays open. The other
  // person saw them there long before the location was hidden, so cutting the
  // thread now protects nothing and only leaves them with a chat that
  // silently stopped working. Blocking is the way out of an unwanted one.
  if (!overlaps(entriesA, entriesB)) return false;
  const existingThread = await prisma.message.findFirst({
    where: {
      OR: [
        { senderId: userIdA, recipientId: userIdB },
        { senderId: userIdB, recipientId: userIdA },
      ],
    },
    select: { id: true },
  });
  return !!existingThread;
}

export interface SharedNightCandidate {
  userId: string;
  venueId: string;
  venueName: string;
  sharedAt: Date;
}

// Batch version of sharedNightExists, for the discovery surface: everyone
// who shares a night+venue with `userId`, most recent shared encounter per
// person. Does not filter by premium/block status — callers do that.
export async function findSharedNightCandidates(userId: string): Promise<SharedNightCandidate[]> {
  const [filters, myHidden] = await Promise.all([
    worldOf(userId).then(world),
    hiddenVenueIds(userId),
  ]);
  const myEntries = await prisma.entryLog.findMany({
    where: { userId, venueId: { notIn: [...myHidden] }, ...filters.entry },
    select: { venueId: true, scannedAt: true },
  });
  if (myEntries.length === 0) return [];

  const venueIds = [...new Set(myEntries.map((e) => e.venueId))];
  const allOtherEntries = await prisma.entryLog.findMany({
    where: { venueId: { in: venueIds }, userId: { not: userId }, ...filters.entry },
    select: { userId: true, venueId: true, scannedAt: true, venue: { select: { name: true } } },
  });

  // The other side's hidden locations have to drop out too -- otherwise
  // hiding one would stop it appearing in your own list while still handing
  // your name to everyone who was there that night.
  const othersHidden = await prisma.venueRelationship.findMany({
    where: {
      userId: { in: [...new Set(allOtherEntries.map((e) => e.userId))] },
      venueId: { in: venueIds },
      hiddenAt: { not: null },
    },
    select: { userId: true, venueId: true },
  });
  const hiddenPairs = new Set(othersHidden.map((h) => `${h.userId}:${h.venueId}`));
  const otherEntries = allOtherEntries.filter((e) => !hiddenPairs.has(`${e.userId}:${e.venueId}`));

  const matches = new Map<string, SharedNightCandidate>();
  for (const mine of myEntries) {
    for (const other of otherEntries) {
      if (other.venueId !== mine.venueId) continue;
      if (Math.abs(other.scannedAt.getTime() - mine.scannedAt.getTime()) > SHARED_NIGHT_WINDOW_MS) continue;

      const existing = matches.get(other.userId);
      if (!existing || other.scannedAt > existing.sharedAt) {
        matches.set(other.userId, {
          userId: other.userId,
          venueId: other.venueId,
          venueName: other.venue.name,
          sharedAt: other.scannedAt,
        });
      }
    }
  }
  return [...matches.values()];
}

async function hasAcceptedConnection(userIdA: string, userIdB: string): Promise<boolean> {
  const connection = await prisma.connectionRequest.findFirst({
    where: {
      status: "ACCEPTED",
      OR: [
        { inviterId: userIdA, inviteeId: userIdB },
        { inviterId: userIdB, inviteeId: userIdA },
      ],
    },
  });
  return !!connection;
}

export async function canMessage(userIdA: string, userIdB: string): Promise<boolean> {
  if (userIdA === userIdB) return false;
  if (await isBlocked(userIdA, userIdB)) return false;

  // A personally accepted invite (see routes/invites.ts) is its own path to
  // messaging, independent of Premium/shared-night -- someone who shared
  // their invite code and accepted a request should be reachable even if
  // neither side has Premium or has ever visited the same venue.
  if (await hasAcceptedConnection(userIdA, userIdB)) return true;

  const [aPremium, bPremium] = await Promise.all([isPremium(userIdA), isPremium(userIdB)]);
  if (!aPremium || !bPremium) return false;

  return sharedNightExists(userIdA, userIdB);
}

// Managers can reach out to guests of their own venue who are either VIP
// (by global trust tier) or Premium subscribers -- e.g. to invite them to
// an event. "Guest of the venue" means they have a VenueRelationship there
// (at least one recorded visit), not just anyone in the network.
export async function canStaffMessage(venueId: string, userId: string): Promise<boolean> {
  const [relationship, { tier }, premium] = await Promise.all([
    prisma.venueRelationship.findFirst({ where: { userId, venueId } }),
    getUserTrust(userId),
    isPremium(userId),
  ]);

  if (!relationship) return false;
  return tier === "VIP" || premium;
}
