import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth, requirePlatformAdmin } from "../middleware/auth";
import { PRIVATE_UPLOAD_DIR } from "./venue-applications";
import { sendVenueApplicationApprovedEmail, sendVenueApplicationRejectedEmail } from "../lib/mailer";
import { t } from "../lib/i18n";

export const adminRouter = Router();

const VENUE_STATUSES = ["PENDING", "VERIFIED", "SUSPENDED"] as const;

adminRouter.get("/venues", requireAuth, requirePlatformAdmin, async (req, res) => {
  const status = (VENUE_STATUSES as readonly string[]).includes(req.query.status as string)
    ? (req.query.status as (typeof VENUE_STATUSES)[number])
    : undefined;

  const venues = await prisma.venue.findMany({
    where: status ? { status } : undefined,
    select: {
      id: true,
      name: true,
      slug: true,
      address: true,
      status: true,
      suspendedAt: true,
      suspendedReason: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(venues);
});

adminRouter.post("/venues/:id/verify", requireAuth, requirePlatformAdmin, async (req, res) => {
  const venue = await prisma.venue.findUnique({ where: { id: req.params.id } });
  if (!venue) return res.status(404).json({ error: t(req.locale, "admin.venueNotFound") });

  const updated = await prisma.venue.update({
    where: { id: venue.id },
    data: { status: "VERIFIED", suspendedAt: null, suspendedReason: null },
  });
  res.json(updated);
});

const suspendSchema = z.object({ reason: z.string().trim().min(1).max(500) });

// Suspending is deliberately not the same as set-demo (see docs/roadmap.md,
// "Locations stilllegen können"): ratings/history already made at this venue
// stay exactly as they are and keep counting towards guests' trust scores --
// only new scans/ratings and public visibility are blocked, same as a
// PENDING venue.
adminRouter.post("/venues/:id/suspend", requireAuth, requirePlatformAdmin, async (req, res) => {
  const parsed = suspendSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const venue = await prisma.venue.findUnique({ where: { id: req.params.id } });
  if (!venue) return res.status(404).json({ error: t(req.locale, "admin.venueNotFound") });
  if (venue.status !== "VERIFIED") {
    return res.status(409).json({ error: t(req.locale, "admin.venueNotVerified") });
  }

  const updated = await prisma.venue.update({
    where: { id: venue.id },
    data: { status: "SUSPENDED", suspendedAt: new Date(), suspendedReason: parsed.data.reason },
  });
  res.json(updated);
});

adminRouter.post("/venues/:id/reactivate", requireAuth, requirePlatformAdmin, async (req, res) => {
  const venue = await prisma.venue.findUnique({ where: { id: req.params.id } });
  if (!venue) return res.status(404).json({ error: t(req.locale, "admin.venueNotFound") });
  if (venue.status !== "SUSPENDED") {
    return res.status(409).json({ error: t(req.locale, "admin.venueNotSuspended") });
  }

  const updated = await prisma.venue.update({
    where: { id: venue.id },
    data: { status: "VERIFIED", suspendedAt: null, suspendedReason: null },
  });
  res.json(updated);
});

// --- Restoring a guest's hidden venues (support action) ---
//
// Hiding is one-way from the guest's own app on purpose (see
// lib/hidden-venues.ts) -- an unhide button there would let anyone holding
// an unlocked phone reveal a location again. This moves the previously
// SSH-only restore path (scripts/unhide-venue.ts) into the dashboard, but
// keeps the same shape: an exact email lookup, never a name/partial search,
// and never surfaced as part of a general guest list -- the fact that
// someone has hidden venues at all is itself sensitive.

const hiddenVenuesQuerySchema = z.object({ email: z.string().trim().email() });

adminRouter.get("/guests/hidden-venues", requireAuth, requirePlatformAdmin, async (req, res) => {
  const parsed = hiddenVenuesQuerySchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user) return res.status(404).json({ error: t(req.locale, "admin.guestNotFound") });

  const hidden = await prisma.venueRelationship.findMany({
    where: { userId: user.id, hiddenAt: { not: null } },
    include: { venue: { select: { id: true, name: true, slug: true } } },
    orderBy: { hiddenAt: "desc" },
  });

  res.json({
    userId: user.id,
    email: user.email,
    hiddenVenues: hidden.map((h) => ({ venueId: h.venue.id, venueName: h.venue.name, hiddenAt: h.hiddenAt })),
  });
});

adminRouter.post(
  "/guests/:userId/venues/:venueId/unhide",
  requireAuth,
  requirePlatformAdmin,
  async (req, res) => {
    const relationship = await prisma.venueRelationship.findUnique({
      where: { userId_venueId: { userId: req.params.userId, venueId: req.params.venueId } },
    });
    if (!relationship || !relationship.hiddenAt) {
      return res.status(404).json({ error: t(req.locale, "admin.hiddenVenueNotFound") });
    }

    await prisma.venueRelationship.update({ where: { id: relationship.id }, data: { hiddenAt: null } });
    res.json({ ok: true });
  }
);

// --- Self-service venue applications ---

const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize("NFKD")
      .replace(COMBINING_MARKS, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "location"
  );
}

async function uniqueSlug(name: string): Promise<string> {
  const base = slugify(name);
  let slug = base;
  for (let i = 1; await prisma.venue.findUnique({ where: { slug } }); i++) {
    slug = `${base}-${i}`;
  }
  return slug;
}

adminRouter.get("/venue-applications", requireAuth, requirePlatformAdmin, async (req, res) => {
  const status =
    req.query.status === "PENDING" || req.query.status === "APPROVED" || req.query.status === "REJECTED"
      ? req.query.status
      : undefined;

  const applications = await prisma.venueApplication.findMany({
    where: status ? { status } : undefined,
    // documentPath/documentMime stay server-side: the filename is the only
    // thing standing between a leaked list and a downloadable document.
    select: {
      id: true,
      venueName: true,
      venueType: true,
      address: true,
      website: true,
      contactName: true,
      contactEmail: true,
      contactPhone: true,
      message: true,
      documentName: true,
      status: true,
      reviewNote: true,
      reviewedAt: true,
      documentDeletedAt: true,
      acceptedTermsVersion: true,
      acceptedTermsAt: true,
      createdVenueId: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(applications);
});

// The only way to read an uploaded business registration. Streams the file
// from server/private-uploads, which is never mounted as a static route.
adminRouter.get("/venue-applications/:id/document", requireAuth, requirePlatformAdmin, async (req, res) => {
  const application = await prisma.venueApplication.findUnique({ where: { id: req.params.id } });
  if (!application) return res.status(404).json({ error: t(req.locale, "admin.applicationNotFound") });

  // documentPath is generated server-side (random hex + fixed extension), but
  // resolving and re-checking the parent directory keeps a future change to
  // how it is produced from turning into a path traversal.
  const filePath = path.resolve(PRIVATE_UPLOAD_DIR, application.documentPath);
  if (path.dirname(filePath) !== path.resolve(PRIVATE_UPLOAD_DIR) || !fs.existsSync(filePath)) {
    return res.status(404).json({ error: t(req.locale, "admin.applicationDocumentMissing") });
  }

  res.setHeader("Content-Type", application.documentMime);
  res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(application.documentName)}"`);
  fs.createReadStream(filePath).pipe(res);
});

const approveSchema = z.object({
  // Lets the admin correct a typo'd name/address from the form before the
  // venue is created, instead of having to fix it afterwards in settings.
  venueName: z.string().trim().min(1).max(120).optional(),
  address: z.string().trim().min(1).max(300).optional(),
  note: z.string().trim().max(2000).optional(),
});

adminRouter.post("/venue-applications/:id/approve", requireAuth, requirePlatformAdmin, async (req, res) => {
  const parsed = approveSchema.safeParse(req.body ?? {});
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const application = await prisma.venueApplication.findUnique({ where: { id: req.params.id } });
  if (!application) return res.status(404).json({ error: t(req.locale, "admin.applicationNotFound") });
  if (application.status !== "PENDING") {
    return res.status(409).json({ error: t(req.locale, "admin.applicationAlreadyReviewed") });
  }

  const venueName = parsed.data.venueName ?? application.venueName;
  const address = parsed.data.address ?? application.address;

  // Approving means the business registration was checked by hand, so the
  // venue starts out VERIFIED -- the PENDING venue state exists for venues
  // created through the staff dashboard without any document review.
  const venue = await prisma.venue.create({
    data: {
      name: venueName,
      address,
      slug: await uniqueSlug(venueName),
      status: "VERIFIED",
      // Mitgenommen, damit die Zustimmung dort steht, wo sie spaeter gebraucht
      // wird: an der Location. Die Bewerbung bleibt zwar erhalten, ist aber
      // nach sechs Monaten nur noch ein Pruefvermerk ohne Dokument.
      acceptedTermsVersion: application.acceptedTermsVersion,
      acceptedTermsAt: application.acceptedTermsAt,
    },
  });

  // An existing staff account (someone who already runs another location)
  // just gains a MANAGER membership and keeps their current password.
  const existing = await prisma.staffAccount.findUnique({ where: { email: application.contactEmail } });
  const staff =
    existing ??
    (await prisma.staffAccount.create({
      data: {
        email: application.contactEmail,
        name: application.contactName,
        // Never a usable password: the account is only reachable through the
        // set-password link mailed out below, or "forgot password" later.
        passwordHash: await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10),
      },
    }));

  await prisma.staffVenueMembership.upsert({
    where: { staffAccountId_venueId: { staffAccountId: staff.id, venueId: venue.id } },
    create: { staffAccountId: staff.id, venueId: venue.id, role: "MANAGER" },
    update: { role: "MANAGER" },
  });

  await prisma.venueApplication.update({
    where: { id: application.id },
    data: {
      status: "APPROVED",
      reviewNote: parsed.data.note,
      reviewedAt: new Date(),
      reviewedById: req.auth!.sub,
      createdVenueId: venue.id,
    },
  });

  if (!existing) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        accountType: "staff",
        accountId: staff.id,
        tokenHash: crypto.createHash("sha256").update(rawToken).digest("hex"),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    const setPasswordUrl = `https://velvet-network.app/reset-password?token=${rawToken}&kind=staff`;
    sendVenueApplicationApprovedEmail(staff.email, venue.name, setPasswordUrl, req.locale).catch((err) =>
      console.error("Failed to send venue approval email", err)
    );
  }

  res.json({ venue, staffAccountId: staff.id, existingAccount: !!existing });
});

const rejectSchema = z.object({ reason: z.string().trim().min(1).max(2000) });

adminRouter.post("/venue-applications/:id/reject", requireAuth, requirePlatformAdmin, async (req, res) => {
  const parsed = rejectSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const application = await prisma.venueApplication.findUnique({ where: { id: req.params.id } });
  if (!application) return res.status(404).json({ error: t(req.locale, "admin.applicationNotFound") });
  if (application.status !== "PENDING") {
    return res.status(409).json({ error: t(req.locale, "admin.applicationAlreadyReviewed") });
  }

  await prisma.venueApplication.update({
    where: { id: application.id },
    data: {
      status: "REJECTED",
      reviewNote: parsed.data.reason,
      reviewedAt: new Date(),
      reviewedById: req.auth!.sub,
    },
  });

  // The rejected applicant's document has served its purpose and is business
  // data we have no reason to keep -- the decision and its reason stay on the
  // application row.
  fs.unlink(path.join(PRIVATE_UPLOAD_DIR, application.documentPath), () => {});

  sendVenueApplicationRejectedEmail(
    application.contactEmail,
    application.venueName,
    parsed.data.reason,
    req.locale
  ).catch((err) => console.error("Failed to send venue rejection email", err));

  res.json({ ok: true });
});
