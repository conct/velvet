// Marks a guest account, staff account or venue as a sandbox ("demo") one --
// or clears the mark. See server/src/lib/demo.ts for what the flag actually
// does; in short, demo and production become two disjoint worlds and nothing
// that happens in the demo one counts anywhere.
//
// This is what the app-store reviewer accounts need: their credentials are
// handed to Google and Apple, so they have to be assumed public, and a public
// login must not be able to rate or ban a real guest.
//
// Usage:
//   npm run set-demo -- user  <email>       [off]
//   npm run set-demo -- staff <email>       [off]
//   npm run set-demo -- venue <slug-or-id>  [off]

import { prisma } from "../src/db";

type Kind = "user" | "staff" | "venue";

function usage(): never {
  console.error("Usage: npm run set-demo -- <user|staff|venue> <email-or-slug> [off]");
  process.exit(1);
}

async function main() {
  const [, , kind, identifier, flag] = process.argv;
  if (!kind || !identifier || (kind !== "user" && kind !== "staff" && kind !== "venue")) usage();
  if (flag !== undefined && flag !== "off") usage();

  const isDemo = flag !== "off";

  if (kind === "user" || kind === "staff") {
    const email = identifier.toLowerCase();
    const account =
      kind === "user"
        ? await prisma.user.findUnique({ where: { email } })
        : await prisma.staffAccount.findUnique({ where: { email } });
    if (!account) {
      console.error(`No ${kind} account found with email ${email}`);
      process.exit(1);
    }
    if (kind === "user") {
      await prisma.user.update({ where: { id: account.id }, data: { isDemo } });
    } else {
      await prisma.staffAccount.update({ where: { id: account.id }, data: { isDemo } });
    }
    console.log(`${kind} ${email} isDemo -> ${isDemo}`);
    return;
  }

  const venue =
    (await prisma.venue.findUnique({ where: { slug: identifier } })) ??
    (await prisma.venue.findUnique({ where: { id: identifier } }));
  if (!venue) {
    console.error(`No venue found with slug or id ${identifier}`);
    process.exit(1);
  }
  await prisma.venue.update({ where: { id: venue.id }, data: { isDemo } });
  console.log(`venue ${venue.name} (${venue.slug}) isDemo -> ${isDemo}`);

  // Flagging the venue alone already neutralises everything recorded there,
  // but leaving its staff unflagged would let those logins be moved to a real
  // venue later and start counting again. Point that out rather than doing it
  // silently -- a venue can have staff who also work elsewhere.
  const staff = await prisma.staffVenueMembership.findMany({
    where: { venueId: venue.id },
    include: { staffAccount: { select: { email: true, isDemo: true } } },
  });
  const mismatched = staff.filter((m) => m.staffAccount.isDemo !== isDemo);
  if (mismatched.length > 0) {
    console.log(`\nStaff-Accounts dieser Location, die noch isDemo=${!isDemo} haben:`);
    for (const m of mismatched) console.log(`  npm run set-demo -- staff ${m.staffAccount.email}${isDemo ? "" : " off"}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
