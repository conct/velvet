import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth, requireStaff } from "../middleware/auth";
import { t } from "../lib/i18n";

export const ratingsRouter = Router();

ratingsRouter.get("/pending", requireAuth, requireStaff, async (req, res) => {
  const since = new Date(Date.now() - 6 * 60 * 60 * 1000);
  const entries = await prisma.entryLog.findMany({
    where: { venueId: req.auth!.venueId, rated: false, scannedAt: { gte: since } },
    include: { user: { select: { firstName: true, lastName: true, photoUrl: true } } },
    orderBy: { scannedAt: "desc" },
    take: 30,
  });

  res.json(
    entries.map((e) => ({
      entryLogId: e.id,
      displayName: `${e.user.firstName} ${e.user.lastName.charAt(0)}.`,
      photoUrl: e.user.photoUrl,
      scannedAt: e.scannedAt,
    }))
  );
});

const createRatingSchema = z.object({
  entryLogId: z.string(),
  stars: z.number().int().min(1).max(5),
  tags: z.array(z.string()).default([]),
  note: z.string().optional(),
  setLocalFlag: z.enum(["NONE", "VIP", "BANNED"]).optional(),
});

// Ratings are always anchored to an EntryLog (a real scanned visit) rather than
// a client-supplied userId — staff never need to hold a raw user id to rate someone.
ratingsRouter.post("/", requireAuth, requireStaff, async (req, res) => {
  const parsed = createRatingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { entryLogId, stars, tags, note, setLocalFlag } = parsed.data;
  const venueId = req.auth!.venueId!;

  const entryLog = await prisma.entryLog.findUnique({ where: { id: entryLogId } });
  if (!entryLog || entryLog.venueId !== venueId) {
    return res.status(404).json({ error: t(req.locale, "qr.entryLogNotFound") });
  }

  const venue = await prisma.venue.findUniqueOrThrow({ where: { id: venueId } });
  if (venue.status !== "VERIFIED") {
    return res.status(403).json({ error: t(req.locale, "qr.venueNotVerified") });
  }

  const userId = entryLog.userId;

  const rating = await prisma.rating.create({
    data: {
      userId,
      venueId,
      staffAccountId: req.auth!.sub,
      stars,
      tags: JSON.stringify(tags),
      note,
    },
  });

  if (setLocalFlag) {
    await prisma.venueRelationship.upsert({
      where: { userId_venueId: { userId, venueId } },
      create: { userId, venueId, localFlag: setLocalFlag },
      update: { localFlag: setLocalFlag },
    });
  }

  await prisma.entryLog.update({ where: { id: entryLogId }, data: { rated: true } });

  res.status(201).json({ id: rating.id });
});
