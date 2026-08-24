// Deletes a venue and everything that only exists because of it.
//
// Until now a venue could only ever be switched on: verify-venue makes one
// VERIFIED, and nothing takes it back. That leaves typos and abandoned
// applications sitting in the public venue list forever.
//
// Deleting is only right for a venue that never operated. Once guests have
// been scanned or rated there, the rows are part of *their* history and an
// input to their trust score -- removing them silently rewrites what other
// venues see about those people. So this refuses to touch a venue with
// ratings or entry logs and says what to do instead. (Deactivating an
// established venue is the separate, still-open roadmap item.)
//
// Usage:
//   npm run delete-venue -- <slug>            # zeigt nur, was passieren würde
//   npm run delete-venue -- <slug> --confirm
//   npm run delete-venue -- <slug> --confirm --with-staff
//
// --with-staff räumt Staff-Konten mit weg, die danach an keiner Location
// mehr hängen -- aber nur, wenn sie selbst keine Spuren hinterlassen haben.

import { prisma } from "../src/db";

function usage(): never {
  console.error("Usage: npm run delete-venue -- <slug> [--confirm] [--with-staff]");
  process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);
  const confirm = args.includes("--confirm");
  const withStaff = args.includes("--with-staff");
  const [slug] = args.filter((a) => !a.startsWith("--"));
  if (!slug) usage();

  const venue = await prisma.venue.findUnique({
    where: { slug },
    include: {
      memberships: { include: { staffAccount: { select: { id: true, email: true } } } },
      _count: { select: { ratings: true, entryLogs: true, relationships: true } },
    },
  });
  if (!venue) {
    console.error(`Keine Location mit dem Slug ${slug}. Vorhanden sind:`);
    const venues = await prisma.venue.findMany({ orderBy: { name: "asc" }, select: { name: true, slug: true, status: true } });
    for (const v of venues) console.error(`  ${v.slug} — ${v.name} (${v.status})`);
    process.exit(1);
  }

  console.log(`Location: ${venue.name} (${venue.slug})`);
  console.log(`Status:   ${venue.status}${venue.isDemo ? ", Sandbox" : ""}`);
  console.log(`Scans:    ${venue._count.entryLogs}`);
  console.log(`Bewertungen: ${venue._count.ratings}`);
  console.log(`Gast-Verknuepfungen (Historie/ausgeblendet): ${venue._count.relationships}`);
  console.log(`Team: ${venue.memberships.length}`);
  for (const m of venue.memberships) console.log(`  ${m.staffAccount.email} (${m.role})`);
  console.log();

  // The hard stop. A venue that has scanned or rated someone is part of that
  // person's record, not ours to erase.
  if (venue._count.entryLogs > 0 || venue._count.ratings > 0) {
    console.error("Diese Location war im Betrieb: es haengen Scans oder Bewertungen daran.");
    console.error("Die gehoeren zur Historie der betroffenen Gaeste und fliessen in deren");
    console.error("Vertrauenswert ein -- Loeschen wuerde den rueckwirkend veraendern.");
    console.error("");
    console.error("Aus der oeffentlichen Liste nehmen laesst sie sich heute nur so:");
    console.error(`  npm run set-demo -- venue ${venue.slug}`);
    console.error("Das schiebt sie in die Sandbox-Welt: unsichtbar fuer echte Gaeste, und");
    console.error("nichts von dort zaehlt noch irgendwo mit. Achtung, das gilt rueckwirkend");
    console.error("auch fuer die bereits vergebenen Bewertungen dieser Location.");
    process.exit(1);
  }

  // A staff account whose only venue this was cannot log in afterwards --
  // /auth/staff/login answers 403 when memberships is empty -- and its email
  // address stays blocked, because StaffAccount.email is unique.
  const orphans: { id: string; email: string }[] = [];
  for (const m of venue.memberships) {
    const others = await prisma.staffVenueMembership.count({
      where: { staffAccountId: m.staffAccount.id, venueId: { not: venue.id } },
    });
    if (others === 0) orphans.push(m.staffAccount);
  }

  const deletableStaff: { id: string; email: string }[] = [];
  if (orphans.length > 0) {
    console.log("Diese Staff-Konten haengen danach an keiner Location mehr");
    console.log("(koennen sich also nicht mehr einloggen, blockieren aber ihre E-Mail):");
    for (const o of orphans) {
      const traces = await prisma.staffAccount.findUniqueOrThrow({
        where: { id: o.id },
        select: { _count: { select: { ratings: true, entryLogs: true, messagesSent: true, messagesReceived: true } } },
      });
      const n = Object.values(traces._count).reduce((a, b) => a + b, 0);
      if (n === 0) {
        deletableStaff.push(o);
        console.log(`  ${o.email} — ohne Spuren, wird mit --with-staff geloescht`);
      } else {
        console.log(`  ${o.email} — hat ${n} Bewertungen/Scans/Nachrichten, bleibt bestehen`);
      }
    }
    console.log();
  }

  const staffToDelete = withStaff ? deletableStaff : [];
  console.log("Geloescht wird:");
  console.log(`  die Location selbst, ${venue.memberships.length} Team-Zuordnung(en), ${venue._count.relationships} Gast-Verknuepfung(en)`);
  console.log(`  ${staffToDelete.length} Staff-Konto(en)${!withStaff && deletableStaff.length > 0 ? "  (--with-staff waere " + deletableStaff.length + ")" : ""}`);

  if (!confirm) {
    console.log("\nNichts geaendert. Zum Ausfuehren dieselbe Zeile mit --confirm wiederholen.");
    return;
  }

  await prisma.$transaction([
    prisma.venueRelationship.deleteMany({ where: { venueId: venue.id } }),
    prisma.staffVenueMembership.deleteMany({ where: { venueId: venue.id } }),
    prisma.venue.delete({ where: { id: venue.id } }),
    ...staffToDelete.map((s) => prisma.staffAccount.delete({ where: { id: s.id } })),
  ]);

  console.log(`\nFertig. "${venue.name}" ist weg.`);
  if (!withStaff && deletableStaff.length > 0) {
    console.log(`${deletableStaff.length} Staff-Konto(en) ohne Location bestehen weiter.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
