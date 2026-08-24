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
    include: { staffAccount: { select: { email: true, isDemo: true, isPlatformAdmin: true } } },
  });
  const mismatched = staff.filter((m) => m.staffAccount.isDemo !== isDemo);

  // Whoever created the sandbox venue through the dashboard is a MANAGER of it
  // -- usually the operator's own admin account. Suggesting they flag
  // themselves would send their real work into the sandbox: their ratings stop
  // counting retroactively and they can no longer scan a real guest. Their
  // membership here is harmless (it is what lets them administer the sandbox),
  // so name them separately instead of handing over the loaded command.
  const admins = mismatched.filter((m) => m.staffAccount.isPlatformAdmin);
  const rest = mismatched.filter((m) => !m.staffAccount.isPlatformAdmin);

  if (rest.length > 0) {
    console.log(`\nStaff-Accounts dieser Location, die noch isDemo=${!isDemo} haben:`);
    for (const m of rest) console.log(`  npm run set-demo -- staff ${m.staffAccount.email}${isDemo ? "" : " off"}`);
  }
  if (admins.length > 0 && isDemo) {
    console.log("\nPlatform-Admins dieser Location - NICHT markieren:");
    for (const m of admins) console.log(`  ${m.staffAccount.email}`);
    console.log("  Die Mitgliedschaft hier ist harmlos und erlaubt das Verwalten der Sandbox.");
    console.log("  Markiert man sie, zaehlen ihre echten Bewertungen rueckwirkend nicht mehr.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
