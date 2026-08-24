import { NextFunction, Request, Response, Router } from "express";
import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";
import { z } from "zod";
import { prisma } from "../db";
import { venueApplicationRateLimit } from "../middleware/rateLimit";
import { sendCustomEmail, sendVenueApplicationReceivedEmail } from "../lib/mailer";
import { t } from "../lib/i18n";

export const venueApplicationsRouter = Router();

// Business registrations are confidential business documents, so they must
// not land in server/uploads -- that directory is mounted as a public static
// route in index.ts, which would make every uploaded Gewerbeanmeldung
// readable by anyone who learns (or guesses) its filename. This directory is
// never served statically; the only way out is the platform-admin-only
// download route in routes/admin.ts.
export const PRIVATE_UPLOAD_DIR = path.join(process.cwd(), "private-uploads");

const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      fs.mkdir(PRIVATE_UPLOAD_DIR, { recursive: true }, (err) => cb(err, PRIVATE_UPLOAD_DIR));
    },
    filename: (_req, file, cb) => {
      const ext = ALLOWED_MIME_TO_EXT[file.mimetype] ?? "";
      cb(null, `gewerbe-${crypto.randomBytes(16).toString("hex")}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TO_EXT[file.mimetype]) {
      cb(new Error(t(req.locale, "venueApplications.invalidDocumentType")));
      return;
    }
    cb(null, true);
  },
});

function uploadDocumentMiddleware(req: Request, res: Response, next: NextFunction) {
  upload.single("document")(req, res, (err: unknown) => {
    if (err) {
      return res
        .status(400)
        .json({ error: err instanceof Error ? err.message : t(req.locale, "venueApplications.invalidDocumentType") });
    }
    next();
  });
}

// Multipart fields always arrive as strings, so this parses the text part of
// the form; the file itself is handled by multer above.
const applicationSchema = z.object({
  venueName: z.string().trim().min(1).max(120),
  venueType: z.enum(["CLUB", "BAR", "PUB", "OTHER"]),
  address: z.string().trim().min(1).max(300),
  website: z.string().trim().url().max(300).optional().or(z.literal("").transform(() => undefined)),
  contactName: z.string().trim().min(1).max(120),
  contactEmail: z.string().trim().email().transform((v) => v.toLowerCase()),
  contactPhone: z.string().trim().max(60).optional().or(z.literal("").transform(() => undefined)),
  message: z.string().trim().max(2000).optional().or(z.literal("").transform(() => undefined)),
});

function discardUpload(file: Express.Multer.File | undefined) {
  if (file) fs.unlink(file.path, () => {});
}

venueApplicationsRouter.post("/", venueApplicationRateLimit, uploadDocumentMiddleware, async (req, res) => {
  const parsed = applicationSchema.safeParse(req.body);
  if (!parsed.success) {
    discardUpload(req.file);
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  if (!req.file) {
    return res.status(400).json({ error: t(req.locale, "venueApplications.documentRequired") });
  }

  const data = parsed.data;

  // One open application per contact address: without this, a resubmit (or a
  // bored visitor) fills the admin review list with duplicates, each with its
  // own uploaded document to store.
  const pending = await prisma.venueApplication.findFirst({
    where: { contactEmail: data.contactEmail, status: "PENDING" },
  });
  if (pending) {
    discardUpload(req.file);
    return res.status(409).json({ error: t(req.locale, "venueApplications.alreadyPending") });
  }

  await prisma.venueApplication.create({
    data: {
      venueName: data.venueName,
      venueType: data.venueType,
      address: data.address,
      website: data.website,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      message: data.message,
      documentName: req.file.originalname,
      documentPath: req.file.filename,
      documentMime: req.file.mimetype,
    },
  });

  sendVenueApplicationReceivedEmail(data.contactEmail, data.venueName, req.locale).catch((err) =>
    console.error("Failed to send venue application confirmation", err)
  );

  // Otherwise a new application only surfaces when someone happens to open
  // /admin/applications -- a Friday-night submission could sit unseen for
  // days with nothing but the applicant's own auto-reply sent so far.
  sendCustomEmail(
    "mail@velvet-network.app",
    `Neue Location-Bewerbung: ${data.venueName}`,
    `${data.venueName} (${data.venueType}) hat sich über /location-anmelden beworben.\n\n` +
      `Kontakt: ${data.contactName} <${data.contactEmail}>${data.contactPhone ? `, ${data.contactPhone}` : ""}\n` +
      `Adresse: ${data.address}\n` +
      (data.website ? `Website: ${data.website}\n` : "") +
      (data.message ? `Nachricht: ${data.message}\n` : "") +
      `\nPrüfen unter https://velvet-network.app/admin/applications`
  ).catch((err) => console.error("Failed to send venue application admin notification", err));

  res.status(201).json({ ok: true, message: t(req.locale, "venueApplications.received") });
});
