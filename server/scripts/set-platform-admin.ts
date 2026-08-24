// Grants (or revokes) platform-admin access for a staff account — lets that
// account see/verify pending venues in the dashboard instead of needing
// verify-venue.ts run by hand. Bootstrap-only: there's no UI to grant this
// to a second account, run this again for that.
//
// Usage: npm run set-platform-admin -- <email> [off]

import { prisma } from "../src/db";

async function main() {
  const [, , email, flag] = process.argv;
  if (!email) {
    console.error("Usage: npm run set-platform-admin -- <email> [off]");
    process.exitCode = 1;
    return;
  }
  const isPlatformAdmin = flag !== "off";

  const staff = await prisma.staffAccount.findUnique({ where: { email } });
  if (!staff) {
    console.error(`No staff account found with email ${email}`);
    process.exitCode = 1;
    return;
  }

  await prisma.staffAccount.update({ where: { id: staff.id }, data: { isPlatformAdmin } });
  console.log(`${email} isPlatformAdmin -> ${isPlatformAdmin}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
