import { GlobalTier } from "./types";

export interface RatingInput {
  stars: number;
  createdAt: Date;
}

/** Exponential recency decay, half-life 90 days. */
const HALF_LIFE_DAYS = 90;

function weightForAge(ageDays: number): number {
  return Math.pow(0.5, ageDays / HALF_LIFE_DAYS);
}

export function computeGlobalScore(ratings: RatingInput[], now: Date = new Date()): number {
  if (ratings.length === 0) return 3.0; // neutral starting point (STANDARD)

  let weightedSum = 0;
  let weightTotal = 0;
  for (const rating of ratings) {
    const ageDays = Math.max(0, (now.getTime() - rating.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const weight = weightForAge(ageDays);
    weightedSum += rating.stars * weight;
    weightTotal += weight;
  }
  return weightTotal > 0 ? weightedSum / weightTotal : 3.0;
}

export function tierFromScore(score: number, networkBanned: boolean): GlobalTier {
  if (networkBanned) return "BANNED";
  if (score >= 4.5) return "VIP";
  if (score >= 3.5) return "TRUSTED";
  if (score >= 2.5) return "STANDARD";
  return "WATCH";
}

/** A guest is network-banned only if flagged BANNED locally by 2+ distinct venues (abuse protection). */
export function isNetworkBanned(distinctBanningVenueCount: number): boolean {
  return distinctBanningVenueCount >= 2;
}
