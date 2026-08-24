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
import { deleteRelayFolders } from "../lib/mailer";
import { world, worldOf } from "../lib/demo";

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

  const [user, inviteCode] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { photoUrl: true } }),
    prisma.userInviteCode.findUnique({ where: { userId }, select: { code: true } }),
  ]);

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

  // Best-effort: purges this user's entire email-relay correspondence
  // (both directions) so deleting the account actually removes it, not
  // just the in-app Message rows. Never blocks the deletion response on it.
  if (inviteCode) {
    deleteRelayFolders(inviteCode.code).catch(() => {});
  }

  res.status(204).end();
});

usersRouter.get("/me/venues", requireAuth, requireUser, async (req, res) => {
  // A sandbox venue never shows up in a real guest's history, and a real one
  // never in a sandbox guest's.
  const filters = world(await worldOf(req.auth!.sub));
  const relationships = await prisma.venueRelationship.findMany({
    where: { userId: req.auth!.sub, hiddenAt: null, ...filters.venue },
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

// One-way on purpose: there is no counterpart to un-hide. Someone going
// through a guest's phone must not be able to reveal a location again by
// toggling it back, so restoring one is a support action
// (server/scripts/unhide-venue.ts). See lib/hidden-venues.ts for what hiding
// does and deliberately does not change.
usersRouter.post("/me/venues/:venueId/hide", requireAuth, requireUser, async (req, res) => {
  const relationship = await prisma.venueRelationship.findUnique({
    where: { userId_venueId: { userId: req.auth!.sub, venueId: req.params.venueId } },
  });
  if (!relationship) return res.status(404).json({ error: t(req.locale, "users.venueNotInHistory") });
  if (relationship.hiddenAt) return res.json({ ok: true });

  await prisma.venueRelationship.update({
    where: { id: relationship.id },
    data: { hiddenAt: new Date() },
  });
  res.json({ ok: true });
});
