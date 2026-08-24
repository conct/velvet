import { Router } from "express";
import { prisma } from "../db";
import { requireAuth, requirePlatformAdmin } from "../middleware/auth";
import { t } from "../lib/i18n";

export const adminRouter = Router();

adminRouter.get("/venues", requireAuth, requirePlatformAdmin, async (req, res) => {
  const status = req.query.status === "VERIFIED" || req.query.status === "PENDING" ? req.query.status : undefined;

  const venues = await prisma.venue.findMany({
    where: status ? { status } : undefined,
    select: { id: true, name: true, slug: true, address: true, status: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(venues);
});

adminRouter.post("/venues/:id/verify", requireAuth, requirePlatformAdmin, async (req, res) => {
  const venue = await prisma.venue.findUnique({ where: { id: req.params.id } });
  if (!venue) return res.status(404).json({ error: t(req.locale, "admin.venueNotFound") });

  const updated = await prisma.venue.update({ where: { id: venue.id }, data: { status: "VERIFIED" } });
  res.json(updated);
});
