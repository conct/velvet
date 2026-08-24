// Moves an existing staff account into the sandbox: strips its memberships at
// real venues, gives it one at the sandbox venue, and flags it isDemo.
//
// This exists because the app-store reviewer accounts have to keep their
// credentials -- they are already filed with Google and Apple -- while losing
// every ability to touch real guests. The dashboard cannot do it: the team
// form always creates a *new* account and rejects an email that already
// exists, so an existing account can never be added to a second venue.
//
// Flagging isDemo alone is not enough. A staff account works in the world of
// the venue it belongs to, so a reviewer sitting in a real venue keeps rating
// real guests no matter what its own flag says. The membership has to move.
//
// Usage:
//   npm run sandbox-staff -- <staff-email> <sandbox-venue-slug> [rolle]
//   npm run sandbox-staff -- <staff-email> <sandbox-venue-slug> [rolle] --confirm
//
// Without --confirm it only reports what it would change. Rolle ist
// MANAGER (Standard), DOORMAN oder SERVICE.

import { STAFF_ROLES, type StaffRole } from "@velvet/shared";
import { prisma } from "../src/db";

function usage(): never {
  console.error("Usage: npm run sandbox-staff -- <staff-email> <sandbox-venue-slug> [MANAGER|DOORMAN|SERVICE] [--confirm]");
  process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);
  const confirm = args.includes("--confirm");
  const [email, slug, roleArg] = args.filter((a) => a !== "--confirm");

  if (!email || !slug) usage();
  const role = (roleArg ?? "MANAGER") as StaffRole;
  if (!STAFF_ROLES.includes(role)) usage();

  const staff = await prisma.staffAccount.findUnique({
    where: { email: email.toLowerCase() },
    include: { memberships: { include: { venue: { select: { name: true, slug: true, isDemo: true } } } } },
  });
  if (!staff) {
    console.error(`Kein Staff-Account mit der E-Mail ${email}`);
    process.exit(1);
  }

  const venue = await prisma.venue.findUnique({ where: { slug } });
  if (!venue) {
    console.error(`Keine Location mit dem Slug ${slug}`);
    process.exit(1);
  }

  // The whole point is isolation, so refuse to "sandbox" someone into a venue
  // that is not one -- that would quietly do the opposite of what was asked.
  if (!venue.isDemo) {
    console.error(`"${venue.name}" ist keine Sandbox-Location (isDemo=false).`);
    console.error(`Erst: npm run set-demo -- venue ${slug}`);
    process.exit(1);
  }

  console.log(`Staff-Account: ${staff.email}  (isDemo=${staff.isDemo})`);
  console.log(`Zielort:       ${venue.name} (${venue.slug}), Rolle ${role}\n`);

  const toRemove = staff.memberships.filter((m) => m.venueId !== venue.id);
  if (toRemove.length === 0) {
    console.log("Keine Mitgliedschaften an anderen Locations.");
  } else {
    console.log("Diese Mitgliedschaften werden entfernt:");
    for (const m of toRemove) {
      const kind = m.venue.isDemo ? "Sandbox" : "ECHTE Location";
      console.log(`  ${m.venue.name} (${m.venue.slug}) — ${m.role}, ${kind}`);
    }
  }

  const already = staff.memberships.find((m) => m.venueId === venue.id);
  console.log(
    already
      ? `\nMitgliedschaft an ${venue.name} besteht bereits (${already.role} -> ${role}).`
      : `\nMitgliedschaft an ${venue.name} wird angelegt (${role}).`
  );
  if (!staff.isDemo) console.log("isDemo wird auf true gesetzt.");

  if (!confirm) {
    console.log("\nNichts geändert. Zum Ausführen dieselbe Zeile mit --confirm wiederholen.");
    return;
  }

  await prisma.$transaction([
    prisma.staffVenueMembership.deleteMany({
      where: { staffAccountId: staff.id, venueId: { not: venue.id } },
    }),
    prisma.staffVenueMembership.upsert({
      where: { staffAccountId_venueId: { staffAccountId: staff.id, venueId: venue.id } },
      create: { staffAccountId: staff.id, venueId: venue.id, role },
      update: { role },
    }),
    prisma.staffAccount.update({ where: { id: staff.id }, data: { isDemo: true } }),
  ]);

  console.log(`\nFertig. ${staff.email} sitzt jetzt ausschliesslich in der Sandbox.`);
  console.log("Bestehende Sitzungen behalten ihr altes Token bis zum naechsten Login -");
  console.log("zur Sicherheit einmal aus- und wieder einloggen lassen.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
