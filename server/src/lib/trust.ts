import { computeGlobalScore, isNetworkBanned, tierFromScore } from "@velvet/shared";
import { prisma } from "../db";

export async function getUserTrust(userId: string) {
  const [ratings, bannedVenueCount] = await Promise.all([
    prisma.rating.findMany({ where: { userId }, select: { stars: true, createdAt: true } }),
    prisma.venueRelationship.count({ where: { userId, localFlag: "BANNED" } }),
  ]);

  const score = computeGlobalScore(ratings);
  const tier = tierFromScore(score, isNetworkBanned(bannedVenueCount));
  return { score, tier };
}
