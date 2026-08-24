// The seed builds its own client instead of going through src/db.ts, so it
// needs to read server/.env itself -- otherwise `npm run seed` fails on a
// fresh checkout with a confusing Prisma error.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hash(pw: string) {
  return bcrypt.hash(pw, 10);
}

// Seeded guests need a photo to be usable at all: /qr/token refuses to issue a
// check-in code without one, so without this the core flow cannot be exercised
// from a fresh seed. A self-contained data URI rather than a placeholder
// service, so it renders offline and pulls in no third party.
function avatar(initials: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">` +
    `<rect width="400" height="400" fill="#1E1B14"/>` +
    `<text x="200" y="200" fill="#D4AF37" font-family="Georgia,serif" font-size="150"` +
    ` text-anchor="middle" dominant-baseline="central">${initials}</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

async function main() {
  console.log("Seeding VELVET demo data...");

  const noir = await prisma.venue.create({
    data: {
      name: "Noir Club Berlin",
      slug: "noir-club-berlin",
      address: "Torstraße 1, 10119 Berlin",
      status: "VERIFIED",
    },
  });

  const velvetHH = await prisma.venue.create({
    data: {
      name: "Velvet Lounge Hamburg",
      slug: "velvet-lounge-hamburg",
      address: "Reeperbahn 42, 20359 Hamburg",
      status: "VERIFIED",
    },
  });

  // A sandbox alongside the demo data, mirroring what production needs for the
  // app-store reviewers: a venue, a staff login and a guest, all flagged
  // isDemo, so nothing done with those credentials reaches a real record.
  // See server/src/lib/demo.ts.
  const sandbox = await prisma.venue.create({
    data: {
      name: "VELVET Testbühne",
      slug: "velvet-testbuehne",
      address: "Teststraße 1, 00000 Teststadt",
      status: "VERIFIED",
      isDemo: true,
    },
  });

  const sandboxStaff = await prisma.staffAccount.create({
    data: {
      email: "review@velvet-network.app",
      passwordHash: await hash("review123"),
      name: "Review Zugang",
      isDemo: true,
    },
  });
  await prisma.staffVenueMembership.create({
    data: { staffAccountId: sandboxStaff.id, venueId: sandbox.id, role: "MANAGER" },
  });

  await prisma.user.create({
    data: {
      email: "review-gast@velvet-network.app",
      passwordHash: await hash("review123"),
      firstName: "Review",
      lastName: "Gast",
      emailVerifiedAt: new Date(),
      photoUrl: avatar("RG"),
      isDemo: true,
    },
  });

  const noirManager = await prisma.staffAccount.create({
    data: { email: "manager@noir.club", passwordHash: await hash("manager123"), name: "Alex Manager" },
  });
  const noirDoormanAccount = await prisma.staffAccount.create({
    data: { email: "tuer@noir.club", passwordHash: await hash("doorman123"), name: "Sam Türsteher" },
  });
  const velvetManager = await prisma.staffAccount.create({
    data: { email: "manager@velvet-hh.club", passwordHash: await hash("manager123"), name: "Nora Manager" },
  });
  const velvetDoormanAccount = await prisma.staffAccount.create({
    data: { email: "tuer@velvet-hh.club", passwordHash: await hash("doorman123"), name: "Kim Türsteher" },
  });

  await prisma.staffVenueMembership.createMany({
    data: [
      { staffAccountId: noirManager.id, venueId: noir.id, role: "MANAGER" },
      { staffAccountId: noirDoormanAccount.id, venueId: noir.id, role: "DOORMAN" },
      { staffAccountId: velvetManager.id, venueId: velvetHH.id, role: "MANAGER" },
      { staffAccountId: velvetDoormanAccount.id, venueId: velvetHH.id, role: "DOORMAN" },
      // Alex also manages Velvet Lounge HH -- ready-made multi-venue test account.
      { staffAccountId: noirManager.id, venueId: velvetHH.id, role: "MANAGER" },
    ],
  });

  const noirDoorman = await prisma.staffAccount.findUniqueOrThrow({ where: { email: "tuer@noir.club" } });
  const velvetDoorman = await prisma.staffAccount.findUniqueOrThrow({ where: { email: "tuer@velvet-hh.club" } });

  const guestPassword = await hash("guest1234");

  const lena = await prisma.user.create({
    data: {
      email: "lena@example.com",
      passwordHash: guestPassword,
      firstName: "Lena",
      lastName: "Klein",
      emailVerifiedAt: new Date(),
      photoUrl: avatar("LK"),
    },
  });
  const max = await prisma.user.create({
    data: {
      email: "max@example.com",
      passwordHash: guestPassword,
      firstName: "Max",
      lastName: "Weber",
      emailVerifiedAt: new Date(),
      photoUrl: avatar("MW"),
    },
  });
  const mia = await prisma.user.create({
    data: {
      email: "mia@example.com",
      passwordHash: guestPassword,
      firstName: "Mia",
      lastName: "Schulz",
      emailVerifiedAt: new Date(),
      photoUrl: avatar("MS"),
    },
  });
  const tom = await prisma.user.create({
    data: {
      email: "tom@example.com",
      passwordHash: guestPassword,
      firstName: "Tom",
      lastName: "Fischer",
      emailVerifiedAt: new Date(),
      photoUrl: avatar("TF"),
    },
  });
  const ben = await prisma.user.create({
    data: {
      email: "ben@example.com",
      passwordHash: guestPassword,
      firstName: "Ben",
      lastName: "Hoffmann",
      emailVerifiedAt: new Date(),
      photoUrl: avatar("BH"),
    },
  });

  // Lena — VIP: konstant top bewertet, umsatzstark, eigene VIP-Liste bei Noir
  await prisma.rating.createMany({
    data: [
      { userId: lena.id, venueId: noir.id, staffAccountId: noirDoorman.id, stars: 5, tags: JSON.stringify(["big_spender", "friendly"]) },
      { userId: lena.id, venueId: noir.id, staffAccountId: noirDoorman.id, stars: 5, tags: JSON.stringify(["big_spender"]) },
      { userId: lena.id, venueId: noir.id, staffAccountId: noirDoorman.id, stars: 4, tags: JSON.stringify(["friendly"]) },
    ],
  });
  await prisma.venueRelationship.create({
    data: { userId: lena.id, venueId: noir.id, visits: 6, lastVisitAt: new Date(), localFlag: "VIP" },
  });

  // Max — Trusted
  await prisma.rating.createMany({
    data: [
      { userId: max.id, venueId: noir.id, staffAccountId: noirDoorman.id, stars: 4, tags: JSON.stringify(["punctual"]) },
      { userId: max.id, venueId: noir.id, staffAccountId: noirDoorman.id, stars: 4, tags: JSON.stringify(["friendly"]) },
    ],
  });
  await prisma.venueRelationship.create({
    data: { userId: max.id, venueId: noir.id, visits: 3, lastVisitAt: new Date() },
  });

  // Mia — Standard, hat beide Locations besucht
  await prisma.rating.createMany({
    data: [
      { userId: mia.id, venueId: noir.id, staffAccountId: noirDoorman.id, stars: 3, tags: JSON.stringify([]) },
      { userId: mia.id, venueId: velvetHH.id, staffAccountId: velvetDoorman.id, stars: 3, tags: JSON.stringify([]) },
    ],
  });
  await prisma.venueRelationship.createMany({
    data: [
      { userId: mia.id, venueId: noir.id, visits: 2, lastVisitAt: new Date() },
      { userId: mia.id, venueId: velvetHH.id, visits: 1, lastVisitAt: new Date() },
    ],
  });

  // Tom — Watch
  await prisma.rating.createMany({
    data: [
      { userId: tom.id, venueId: noir.id, staffAccountId: noirDoorman.id, stars: 2, tags: JSON.stringify(["too_intoxicated"]) },
      { userId: tom.id, venueId: noir.id, staffAccountId: noirDoorman.id, stars: 2, tags: JSON.stringify([]) },
    ],
  });
  await prisma.venueRelationship.create({
    data: { userId: tom.id, venueId: noir.id, visits: 2, lastVisitAt: new Date() },
  });

  // Ben — network-weit gesperrt (an 2 Venues als BANNED geflaggt)
  await prisma.rating.createMany({
    data: [
      { userId: ben.id, venueId: noir.id, staffAccountId: noirDoorman.id, stars: 1, tags: JSON.stringify(["trouble"]), note: "Randale an der Bar" },
      { userId: ben.id, venueId: velvetHH.id, staffAccountId: velvetDoorman.id, stars: 1, tags: JSON.stringify(["trouble"]) },
    ],
  });
  await prisma.venueRelationship.createMany({
    data: [
      { userId: ben.id, venueId: noir.id, visits: 1, lastVisitAt: new Date(), localFlag: "BANNED", privateNote: "Hausverbot nach Vorfall" },
      { userId: ben.id, venueId: velvetHH.id, visits: 1, lastVisitAt: new Date(), localFlag: "BANNED" },
    ],
  });

  console.log("Fertig. Demo-Logins:");
  console.log("  Manager (Noir + Velvet HH, multi-venue): manager@noir.club / manager123");
  console.log("  Türsteher (Noir): tuer@noir.club / doorman123");
  console.log("  Gast VIP:         lena@example.com / guest1234");
  console.log("  Gast Trusted:     max@example.com / guest1234");
  console.log("  Gast Standard:    mia@example.com / guest1234");
  console.log("  Gast Watch:       tom@example.com / guest1234");
  console.log("  Gast Banned:      ben@example.com / guest1234");
  console.log("");
  console.log("  Sandbox (isDemo, zaehlt nirgends mit):");
  console.log("    Staff: review@velvet-network.app / review123  (VELVET Testbuehne)");
  console.log("    Gast:  review-gast@velvet-network.app / review123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
