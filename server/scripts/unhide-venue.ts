// Support action: puts a location a guest hid back into their history.
//
// Hiding is one-way from the app on purpose (see server/src/lib/hidden-venues.ts)
// -- an unhide button in the guest's own UI would let anyone holding their
// unlocked phone reveal exactly the locations they wanted out of sight. So
// undoing it happens here, after the person has actually asked for it.
//
// Usage:
//   npm run unhide-venue -- <gast-email> [venue-slug]
//
// Without a slug it only lists what that guest currently has hidden, so the
// right one can be picked before anything is changed.

import { prisma } from "../src/db";

async function main() {
  const [, , email, slug] = process.argv;
  if (!email) {
    console.error("Usage: npm run unhide-venue -- <gast-email> [venue-slug]");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    console.error(`Kein Gast-Account mit der E-Mail ${email}`);
    process.exit(1);
  }

  const hidden = await prisma.venueRelationship.findMany({
    where: { userId: user.id, hiddenAt: { not: null } },
    include: { venue: { select: { name: true, slug: true } } },
    orderBy: { hiddenAt: "desc" },
  });

  if (hidden.length === 0) {
    console.log(`${email} hat aktuell keine Location ausgeblendet.`);
    return;
  }

  if (!slug) {
    console.log(`Ausgeblendet von ${email}:`);
    for (const h of hidden) {
      console.log(`  ${h.venue.slug.padEnd(28)} ${h.venue.name}  (seit ${h.hiddenAt?.toISOString().slice(0, 10)})`);
    }
    console.log(`\nZum Wiederherstellen: npm run unhide-venue -- ${email} <venue-slug>`);
    return;
  }

  const match = hidden.find((h) => h.venue.slug === slug);
  if (!match) {
    console.error(`${email} hat "${slug}" nicht ausgeblendet. Ohne Slug aufrufen, um die Liste zu sehen.`);
    process.exit(1);
  }

  await prisma.venueRelationship.update({ where: { id: match.id }, data: { hiddenAt: null } });
  console.log(`${match.venue.name} ist wieder in der Historie von ${email} sichtbar.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
