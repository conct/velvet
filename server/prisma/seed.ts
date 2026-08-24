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
    data: { email: "lena@example.com", passwordHash: guestPassword, firstName: "Lena", lastName: "Klein" },
  });
  const max = await prisma.user.create({
    data: { email: "max@example.com", passwordHash: guestPassword, firstName: "Max", lastName: "Weber" },
  });
  const mia = await prisma.user.create({
    data: { email: "mia@example.com", passwordHash: guestPassword, firstName: "Mia", lastName: "Schulz" },
  });
  const tom = await prisma.user.create({
    data: { email: "tom@example.com", passwordHash: guestPassword, firstName: "Tom", lastName: "Fischer" },
  });
  const ben = await prisma.user.create({
    data: { email: "ben@example.com", passwordHash: guestPassword, firstName: "Ben", lastName: "Hoffmann" },
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
