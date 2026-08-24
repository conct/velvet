// Manually marks a venue as verified, unlocking QR check-in and ratings for
// it. No admin UI/role exists in this app -- this is intentionally a manual
// step you run yourself after checking a self-service-created venue is real.
//
// Usage: npm run verify-venue -- <slug>

import { prisma } from "../src/db";

async function main() {
  const [, , slug] = process.argv;
  if (!slug) {
    console.error("Usage: npm run verify-venue -- <slug>");
    process.exitCode = 1;
    return;
  }

  const venue = await prisma.venue.findUnique({ where: { slug } });
  if (!venue) {
    console.error(`No venue found with slug "${slug}"`);
    process.exitCode = 1;
    return;
  }

  if (venue.status === "VERIFIED") {
    console.log(`"${venue.name}" is already verified.`);
    return;
  }

  await prisma.venue.update({ where: { id: venue.id }, data: { status: "VERIFIED" } });
  console.log(`Verified "${venue.name}" (${slug}).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
