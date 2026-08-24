// Deletes the uploaded Gewerbeanmeldung of an APPROVED venue application 6
// months after it was reviewed. reviewedAt/reviewedById stay untouched --
// they are the permanent record that the check happened; only the document
// itself is time-limited (Daniel, 2026-08-24: datensparsam, ein Prüfvermerk
// reicht als Nachweis). Rejected applications already have their document
// deleted immediately on rejection (see routes/admin.ts), so this only ever
// touches APPROVED ones.
//
// No cron exists in this project (see docs/deployment.md) -- run this by
// hand periodically, e.g. alongside a deploy: npm run purge-expired-applications

import fs from "fs";
import path from "path";
import { prisma } from "../src/db";
import { PRIVATE_UPLOAD_DIR } from "../src/routes/venue-applications";

const RETENTION_MS = 6 * 30 * 24 * 60 * 60 * 1000; // 6 Monate (30-Tage-Monate, keine Kalenderpräzision nötig)

async function main() {
  const cutoff = new Date(Date.now() - RETENTION_MS);

  const expired = await prisma.venueApplication.findMany({
    where: { status: "APPROVED", reviewedAt: { lt: cutoff }, documentDeletedAt: null },
  });

  if (expired.length === 0) {
    console.log("Keine Gewerbeanmeldung über der 6-Monats-Frist -- nichts zu tun.");
    return;
  }

  for (const application of expired) {
    const filePath = path.join(PRIVATE_UPLOAD_DIR, application.documentPath);
    await fs.promises.unlink(filePath).catch((err) => {
      // Schon weg (z.B. durch einen manuellen Aufräum-Lauf) ist kein Fehler --
      // wir wollen trotzdem documentDeletedAt setzen, damit dieser Lauf nicht
      // jedes Mal erneut versucht.
      if (err.code !== "ENOENT") throw err;
    });

    await prisma.venueApplication.update({
      where: { id: application.id },
      data: { documentDeletedAt: new Date() },
    });

    console.log(`Gelöscht: ${application.venueName} (Bewerbung ${application.id}, geprüft am ${application.reviewedAt?.toISOString().slice(0, 10)})`);
  }

  console.log(`\n${expired.length} Dokument(e) gelöscht.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
