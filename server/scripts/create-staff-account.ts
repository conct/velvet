// Creates a staff account from the command line -- the break-glass tool for
// when nobody can get into the dashboard any more.
//
// The dashboard cannot do this in that situation: creating staff runs through
// POST /venues/me/staff, which requires being logged in as a MANAGER of the
// venue in question. Lose the last account with access to a venue (or the last
// platform admin) and there is no way back through the UI, and
// set-platform-admin does not help because it needs an account that already
// exists. This closes that hole.
//
// No password is taken as an argument -- it would end up in the shell history
// and in the process list. One is generated and printed once instead. No email
// is sent either: a lockout is exactly the moment not to depend on SMTP being
// configured.
//
// Usage:
//   npm run create-staff-account -- <email> "<Name>" <venue-slug> [MANAGER|DOORMAN|SERVICE] [--admin]

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { STAFF_ROLES, type StaffRole } from "@velvet/shared";
import { prisma } from "../src/db";

function usage(): never {
  console.error('Usage: npm run create-staff-account -- <email> "<Name>" <venue-slug> [MANAGER|DOORMAN|SERVICE] [--admin]');
  process.exit(1);
}

// Ambiguous characters left out so the password survives being read aloud or
// copied off a screen during an incident.
function generatePassword(): string {
  const alphabet = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(crypto.randomBytes(20))
    .map((b) => alphabet[b % alphabet.length])
    .join("");
}

async function main() {
  const args = process.argv.slice(2);
  const isAdmin = args.includes("--admin");
  const [emailArg, name, slug, roleArg] = args.filter((a) => a !== "--admin");

  if (!emailArg || !name || !slug) usage();
  const role = (roleArg ?? "MANAGER") as StaffRole;
  if (!STAFF_ROLES.includes(role)) usage();

  const email = emailArg.toLowerCase();

  const existing = await prisma.staffAccount.findUnique({ where: { email } });
  if (existing) {
    console.error(`Es gibt bereits ein Staff-Konto mit ${email}.`);
    console.error("Passwort zuruecksetzen: ueber \"Passwort vergessen\" im Dashboard.");
    console.error(`Admin-Rechte geben:     npm run set-platform-admin -- ${email}`);
    process.exit(1);
  }

  const venue = await prisma.venue.findUnique({ where: { slug } });
  if (!venue) {
    console.error(`Keine Location mit dem Slug ${slug}. Vorhanden sind:`);
    const venues = await prisma.venue.findMany({ orderBy: { name: "asc" }, select: { name: true, slug: true, isDemo: true } });
    for (const v of venues) console.error(`  ${v.slug}${v.isDemo ? " (Sandbox)" : ""} — ${v.name}`);
    process.exit(1);
  }

  // Platform admins are not scoped to a world: requirePlatformAdmin only looks
  // at the flag, so a sandbox account with --admin could approve real venue
  // applications and download real Gewerbeanmeldungen. Give the flag to a real
  // account only.
  if (isAdmin && venue.isDemo) {
    console.error(`"${venue.name}" ist eine Sandbox-Location — --admin waere hier echter Admin-Zugriff.`);
    console.error("Platform-Admins gehoeren an eine echte Location.");
    process.exit(1);
  }

  const password = generatePassword();
  const staff = await prisma.staffAccount.create({
    data: {
      email,
      name,
      passwordHash: await bcrypt.hash(password, 10),
      isPlatformAdmin: isAdmin,
      // A staff account belongs to the world of its venue, so inherit it --
      // putting a real login into a sandbox venue, or the reverse, only
      // creates an account that cannot scan anyone.
      isDemo: venue.isDemo,
    },
  });
  await prisma.staffVenueMembership.create({
    data: { staffAccountId: staff.id, venueId: venue.id, role },
  });

  console.log(`Angelegt: ${staff.name} <${staff.email}>`);
  console.log(`Location: ${venue.name} (${venue.slug})${venue.isDemo ? " — Sandbox" : ""}, Rolle ${role}`);
  console.log(`Platform-Admin: ${isAdmin ? "ja" : "nein"}`);
  console.log(`\n  Passwort: ${password}`);
  console.log("\nWird nur dieses eine Mal angezeigt. Nach dem ersten Login aendern");
  console.log('(Dashboard -> abmelden -> "Passwort vergessen").');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
