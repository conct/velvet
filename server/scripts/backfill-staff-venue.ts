// One-time production backfill for the multi-venue migration. Run AFTER the
// additive schema push (StaffVenueMembership + Venue.status added) but
// BEFORE deploying any server code that reads them -- see docs/deployment.md
// for the full rollout sequence. Idempotent: safe to re-run.
//
// Reads StaffAccount.venueId/role via raw SQL because by the time this
// script exists, the generated Prisma client is already built from the
// target schema and no longer has typed fields for those columns (they're
// still physically present on the table at this point in the rollout,
// just not modeled -- the destructive column drop is a separate, later step).
//
// Usage: npm run backfill:staff-venue

import { prisma } from "../src/db";

interface LegacyStaffRow {
  id: string;
  venueId: string;
  role: string;
}

async function main() {
  const legacyStaff = await prisma.$queryRawUnsafe<LegacyStaffRow[]>(
    `SELECT id, venueId, role FROM StaffAccount`
  );

  let created = 0;
  let skipped = 0;
  for (const staff of legacyStaff) {
    const existing = await prisma.staffVenueMembership.findUnique({
      where: { staffAccountId_venueId: { staffAccountId: staff.id, venueId: staff.venueId } },
    });
    if (existing) {
      skipped++;
      continue;
    }
    await prisma.staffVenueMembership.create({
      data: { staffAccountId: staff.id, venueId: staff.venueId, role: staff.role },
    });
    created++;
  }

  const { count: verifiedCount } = await prisma.venue.updateMany({
    where: { status: { not: "VERIFIED" } },
    data: { status: "VERIFIED" },
  });

  console.log(`Staff accounts scanned: ${legacyStaff.length}`);
  console.log(`Memberships created: ${created} (already existed: ${skipped})`);
  console.log(`Venues flipped to VERIFIED: ${verifiedCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
