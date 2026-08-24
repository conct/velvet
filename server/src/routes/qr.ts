import { Router } from "express";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth, requireScanner, requireUser } from "../middleware/auth";
import { qrVerifyRateLimit } from "../middleware/rateLimit";
import { getUserTrust } from "../lib/trust";
import { assertSameWorld, CrossWorldError } from "../lib/demo";
import { t } from "../lib/i18n";

export const qrRouter = Router();

// Codes are short on purpose: the previous design encoded a full signed JWT
// (150+ chars) into the QR, which produced a QR dense enough that neither
// the web camera nor the native scanner could reliably read it. A 6-digit
// code keeps the QR scannable at typical webcam/phone resolutions and is
// also short enough for a doorman to type in by hand when scanning fails.
const CODE_TTL_MS = 90_000;

interface ActiveCode {
  userId: string;
  expiresAt: number;
}

const activeCodes = new Map<string, ActiveCode>();

setInterval(() => {
  const now = Date.now();
  for (const [code, entry] of activeCodes) {
    if (entry.expiresAt < now) activeCodes.delete(code);
  }
}, 30_000).unref();

function generateCode(): string {
  let code: string;
  do {
    code = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
  } while (activeCodes.has(code));
  return code;
}

qrRouter.post("/token", requireAuth, requireUser, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.auth!.sub }, select: { photoUrl: true } });
  if (!user?.photoUrl) {
    return res.status(403).json({ error: t(req.locale, "qr.photoRequired"), code: "PHOTO_REQUIRED" });
  }

  const code = generateCode();
  const expiresAt = Date.now() + CODE_TTL_MS;
  activeCodes.set(code, { userId: req.auth!.sub, expiresAt });
  res.json({ code, expiresAt });
});

const verifySchema = z.object({ code: z.string().trim() });

qrRouter.post("/verify", requireAuth, requireScanner, qrVerifyRateLimit, async (req, res) => {
  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const entry = activeCodes.get(parsed.data.code);
  if (!entry || entry.expiresAt < Date.now()) {
    return res.status(400).json({ error: t(req.locale, "qr.codeInvalidOrExpired") });
  }
  // Single-use: remove immediately so the same code can't be verified twice.
  activeCodes.delete(parsed.data.code);

  const user = await prisma.user.findUnique({ where: { id: entry.userId } });
  if (!user) return res.status(404).json({ error: t(req.locale, "qr.guestNotFound") });

  const venueId = req.auth!.venueId!;
  const staffAccountId = req.auth!.sub;

  const venue = await prisma.venue.findUniqueOrThrow({ where: { id: venueId } });
  if (venue.status !== "VERIFIED") {
    return res.status(403).json({ error: t(req.locale, "qr.venueNotVerified") });
  }

  // Checked before the first write: a sandbox login must not be able to put a
  // visit, a rating or a ban on a real guest's record. See lib/demo.ts.
  try {
    await assertSameWorld(venueId, user.id);
  } catch (err) {
    if (err instanceof CrossWorldError) {
      return res.status(403).json({ error: t(req.locale, "qr.demoWorldMismatch") });
    }
    throw err;
  }

  const relationship = await prisma.venueRelationship.upsert({
    where: { userId_venueId: { userId: user.id, venueId } },
    create: { userId: user.id, venueId, visits: 1, lastVisitAt: new Date() },
    update: { visits: { increment: 1 }, lastVisitAt: new Date() },
  });

  const entryLog = await prisma.entryLog.create({
    data: { userId: user.id, venueId, staffAccountId },
  });

  const { score, tier } = await getUserTrust(user.id);

  res.json({
    displayName: `${user.firstName} ${user.lastName.charAt(0)}.`,
    photoUrl: user.photoUrl,
    photoConfirmed: !!user.photoConfirmedAt,
    globalTier: tier,
    globalScore: Number(score.toFixed(2)),
    venue: {
      visits: relationship.visits,
      lastVisitAt: relationship.lastVisitAt,
      localFlag: relationship.localFlag,
      privateNote: relationship.privateNote,
    },
    entryLogId: entryLog.id,
  });
});

const confirmPhotoSchema = z.object({ entryLogId: z.string().min(1) });

// Automated photo quality checks are limited to resolution (see
// server/src/lib/photo-verification.ts) -- actually confirming the photo
// shows the person holding it happens here instead, in person, the first
// time staff scans someone with an unconfirmed picture.
qrRouter.post("/confirm-photo", requireAuth, requireScanner, async (req, res) => {
  const parsed = confirmPhotoSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const entryLog = await prisma.entryLog.findUnique({ where: { id: parsed.data.entryLogId } });
  if (!entryLog || entryLog.staffAccountId !== req.auth!.sub) {
    return res.status(404).json({ error: t(req.locale, "qr.entryLogNotFound") });
  }

  // Vouching for a stranger's photo is exactly the kind of permanent mark on
  // someone else's account a sandbox login must not be able to leave, so this
  // is re-checked here rather than trusted to the entry log's provenance.
  try {
    await assertSameWorld(entryLog.venueId, entryLog.userId);
  } catch (err) {
    if (err instanceof CrossWorldError) {
      return res.status(403).json({ error: t(req.locale, "qr.demoWorldMismatch") });
    }
    throw err;
  }

  await prisma.user.update({ where: { id: entryLog.userId }, data: { photoConfirmedAt: new Date() } });
  res.json({ ok: true });
});
