// Grants (or extends) free Premium access to a guest, without going through
// Stripe/PayPal. For comping influencers etc. — run manually, not exposed
// via any HTTP endpoint.
//
// Usage: npm run comp -- someone@example.com [months]   (months defaults to 12)

import { prisma } from "../src/db";

async function main() {
  const [, , email, monthsArg] = process.argv;
  if (!email) {
    console.error("Usage: npm run comp -- <email> [months=12]");
    process.exitCode = 1;
    return;
  }
  const months = monthsArg ? parseInt(monthsArg, 10) : 12;
  if (!Number.isFinite(months) || months <= 0) {
    console.error("months must be a positive number");
    process.exitCode = 1;
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No user found with email ${email}`);
    process.exitCode = 1;
    return;
  }

  const currentPeriodEnd = new Date();
  currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + months);

  const existing = await prisma.subscription.findFirst({
    where: { userId: user.id, provider: "COMPED" },
  });

  if (existing) {
    await prisma.subscription.update({
      where: { id: existing.id },
      data: { status: "ACTIVE", currentPeriodEnd, cancelAtPeriodEnd: false },
    });
    console.log(`Extended comped Premium for ${email} until ${currentPeriodEnd.toISOString()}`);
  } else {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        provider: "COMPED",
        providerSubId: `comped_${user.id}`,
        status: "ACTIVE",
        interval: months >= 12 ? "YEAR" : "MONTH",
        currentPeriodEnd,
      },
    });
    console.log(`Granted comped Premium for ${email} until ${currentPeriodEnd.toISOString()}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
