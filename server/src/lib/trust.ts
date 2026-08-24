import { computeGlobalScore, isNetworkBanned, tierFromScore } from "@velvet/shared";
import { prisma } from "../db";
import { world, worldOf } from "./demo";

export async function getUserTrust(userId: string) {
  // Ratings and bans only count from the guest's own world, so a sandbox
  // login can never move a real score -- and a sandbox guest still gets a
  // real-looking one of their own.
  const filters = world(await worldOf(userId));

  const [ratings, bannedVenueCount] = await Promise.all([
    prisma.rating.findMany({
      where: { userId, ...filters.rating },
      select: { stars: true, createdAt: true },
    }),
    prisma.venueRelationship.count({ where: { userId, localFlag: "BANNED", ...filters.venue } }),
  ]);

  const score = computeGlobalScore(ratings);
  const tier = tierFromScore(score, isNetworkBanned(bannedVenueCount));
  return { score, tier };
}
