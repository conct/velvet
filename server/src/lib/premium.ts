import { prisma } from "../db";

export async function getPremiumStatus(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE", currentPeriodEnd: { gt: new Date() } },
    orderBy: { currentPeriodEnd: "desc" },
  });
  return { isPremium: !!subscription, subscription };
}

export async function isPremium(userId: string): Promise<boolean> {
  const { isPremium } = await getPremiumStatus(userId);
  return isPremium;
}
