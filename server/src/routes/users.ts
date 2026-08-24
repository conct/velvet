import { NextFunction, Request, Response, Router } from "express";
import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";
import { tierLabels } from "@velvet/shared";
import { prisma } from "../db";
import { requireAuth, requireUser } from "../middleware/auth";
import { getUserTrust } from "../lib/trust";
import { verifyProfilePhoto } from "../lib/photo-verification";
import { t } from "../lib/i18n";

export const usersRouter = Router();

const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(process.cwd(), "uploads"),
    filename: (req, file, cb) => {
      const ext = ALLOWED_MIME_TO_EXT[file.mimetype] ?? "";
      cb(null, `${req.auth!.sub}-${crypto.randomBytes(8).toString("hex")}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TO_EXT[file.mimetype]) {
      cb(new Error(t(req.locale, "users.invalidImageType")));
      return;
    }
    cb(null, true);
  },
});

usersRouter.get("/me", requireAuth, requireUser, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.auth!.sub } });
  if (!user) return res.status(404).json({ error: t(req.locale, "users.notFound") });

  const { score, tier } = await getUserTrust(user.id);

  res.json({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    photoUrl: user.photoUrl,
    globalTier: tier,
    globalTierLabel: tierLabels[tier],
    globalScore: Number(score.toFixed(2)),
  });
});

function uploadPhotoMiddleware(req: Request, res: Response, next: NextFunction) {
  upload.single("photo")(req, res, (err: unknown) => {
    if (err) return res.status(400).json({ error: err instanceof Error ? err.message : t(req.locale, "users.uploadFailed") });
    next();
  });
}

usersRouter.post("/me/photo", requireAuth, requireUser, uploadPhotoMiddleware, async (req, res) => {
  if (!req.file) return res.status(400).json({ error: t(req.locale, "users.noImageProvided") });

  const verification = await verifyProfilePhoto(req.file.path, req.locale);
  if (!verification.ok) {
    fs.unlink(req.file.path, () => {});
    return res.status(400).json({ error: verification.reason ?? t(req.locale, "users.photoRequirementsNotMet") });
  }

  const previous = await prisma.user.findUnique({ where: { id: req.auth!.sub }, select: { photoUrl: true } });
  const photoUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  // A new photo needs re-confirming at the door -- staff visually confirming
  // the old one doesn't carry over to a picture they've never seen.
  await prisma.user.update({ where: { id: req.auth!.sub }, data: { photoUrl, photoConfirmedAt: null } });

  if (previous?.photoUrl?.includes("/uploads/")) {
    const oldFilename = previous.photoUrl.split("/uploads/")[1];
    if (oldFilename) {
      fs.unlink(path.join(process.cwd(), "uploads", oldFilename), () => {});
    }
  }

  res.json({ photoUrl });
});

usersRouter.delete("/me", requireAuth, requireUser, async (req, res) => {
  const userId = req.auth!.sub;

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { photoUrl: true } });

  await prisma.$transaction([
    prisma.rating.deleteMany({ where: { userId } }),
    prisma.entryLog.deleteMany({ where: { userId } }),
    prisma.venueRelationship.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  if (user?.photoUrl?.includes("/uploads/")) {
    const filename = user.photoUrl.split("/uploads/")[1];
    if (filename) {
      fs.unlink(path.join(process.cwd(), "uploads", filename), () => {});
    }
  }

  res.status(204).end();
});

usersRouter.get("/me/venues", requireAuth, requireUser, async (req, res) => {
  const relationships = await prisma.venueRelationship.findMany({
    where: { userId: req.auth!.sub },
    include: { venue: true },
    orderBy: { lastVisitAt: "desc" },
  });

  res.json(
    relationships.map((r) => ({
      venue: { id: r.venue.id, name: r.venue.name, address: r.venue.address, logoUrl: r.venue.logoUrl },
      visits: r.visits,
      lastVisitAt: r.lastVisitAt,
      localFlag: r.localFlag,
    }))
  );
});
