import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth, requireStaff } from "../middleware/auth";
import { authRateLimit } from "../middleware/rateLimit";
import { sendPasswordResetEmail, sendVerificationEmail } from "../lib/mailer";
import { t, type Locale } from "../lib/i18n";

export const authRouter = Router();

function signSessionToken(payload: object, options?: jwt.SignOptions) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "30d", algorithm: "HS256", ...options });
}

async function issueVenueScopedSession(staffAccountId: string, venueId: string) {
  const membership = await prisma.staffVenueMembership.findUnique({
    where: { staffAccountId_venueId: { staffAccountId, venueId } },
  });
  if (!membership) return null;

  const staff = await prisma.staffAccount.findUniqueOrThrow({ where: { id: staffAccountId } });
  const venue = await prisma.venue.findUniqueOrThrow({ where: { id: venueId } });

  const token = signSessionToken({
    sub: staff.id,
    type: "staff",
    venueId: venue.id,
    role: membership.role,
    isPlatformAdmin: staff.isPlatformAdmin,
  });
  return {
    token,
    staff: {
      id: staff.id,
      email: staff.email,
      name: staff.name,
      role: membership.role,
      venue,
      isPlatformAdmin: staff.isPlatformAdmin,
    },
  };
}

async function issueVerificationEmail(user: { id: string; email: string }, locale: Locale) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
  const verifyUrl = `https://velvet-network.app/verify-email?token=${rawToken}`;
  sendVerificationEmail(user.email, verifyUrl, locale).catch((err) => console.error("Failed to send verification email", err));
}

const registerSchema = z.object({
  email: z.string().trim().email().transform((v) => v.toLowerCase()),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
});

authRouter.post("/register", authRateLimit, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password, firstName, lastName, phone } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: t(req.locale, "auth.emailAlreadyRegistered") });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, firstName, lastName, phone },
  });

  await issueVerificationEmail(user, req.locale);

  res.status(201).json({
    requiresVerification: true,
    message: t(req.locale, "auth.verificationSent"),
  });
});

const loginSchema = z.object({
  email: z.string().trim().email().transform((v) => v.toLowerCase()),
  password: z.string(),
});

authRouter.post("/login", authRateLimit, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: t(req.locale, "auth.wrongCredentials") });
  }
  if (!user.emailVerifiedAt) {
    return res.status(403).json({ error: t(req.locale, "auth.emailNotVerified"), code: "EMAIL_NOT_VERIFIED" });
  }

  const token = signSessionToken({ sub: user.id, type: "user" });
  res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName } });
});

const verifyEmailSchema = z.object({ token: z.string().min(1) });

authRouter.post("/verify-email", authRateLimit, async (req, res) => {
  const parsed = verifyEmailSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const tokenHash = crypto.createHash("sha256").update(parsed.data.token).digest("hex");
  const verificationToken = await prisma.emailVerificationToken.findUnique({ where: { tokenHash } });

  if (!verificationToken || verificationToken.usedAt || verificationToken.expiresAt < new Date()) {
    return res.status(400).json({ error: t(req.locale, "auth.linkInvalidOrExpired") });
  }

  const user = await prisma.user.update({
    where: { id: verificationToken.userId },
    data: { emailVerifiedAt: new Date() },
  });
  await prisma.emailVerificationToken.update({ where: { id: verificationToken.id }, data: { usedAt: new Date() } });

  const token = signSessionToken({ sub: user.id, type: "user" });
  res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName } });
});

const resendVerificationSchema = z.object({
  email: z.string().trim().email().transform((v) => v.toLowerCase()),
});

authRouter.post("/resend-verification", authRateLimit, async (req, res) => {
  const parsed = resendVerificationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  // Same response whether or not the account exists / is already verified, so this can't be used to enumerate emails.
  if (user && !user.emailVerifiedAt) {
    await issueVerificationEmail(user, req.locale);
  }

  res.json({ ok: true });
});

authRouter.post("/staff/login", authRateLimit, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;

  const staff = await prisma.staffAccount.findUnique({
    where: { email },
    include: { memberships: { include: { venue: true } } },
  });
  if (!staff || !(await bcrypt.compare(password, staff.passwordHash))) {
    return res.status(401).json({ error: t(req.locale, "auth.wrongCredentials") });
  }
  if (staff.memberships.length === 0) {
    return res.status(403).json({ error: t(req.locale, "auth.staffNoVenue") });
  }

  if (staff.memberships.length === 1) {
    const session = await issueVenueScopedSession(staff.id, staff.memberships[0].venueId);
    return res.json(session);
  }

  const preAuthToken = signSessionToken({ sub: staff.id, type: "staff-pending-venue" }, { expiresIn: "5m" });
  res.json({
    needsVenueSelection: true,
    preAuthToken,
    venues: staff.memberships.map((m) => ({ id: m.venue.id, name: m.venue.name, status: m.venue.status })),
  });
});

const selectVenueSchema = z.object({ venueId: z.string().min(1) });

authRouter.post("/staff/select-venue", requireAuth, async (req, res) => {
  if (req.auth?.type !== "staff-pending-venue") {
    return res.status(403).json({ error: t(req.locale, "auth.invalidTokenType") });
  }
  const parsed = selectVenueSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const session = await issueVenueScopedSession(req.auth.sub, parsed.data.venueId);
  if (!session) return res.status(403).json({ error: t(req.locale, "auth.noVenueAccess") });
  res.json(session);
});

authRouter.post("/staff/switch-venue", requireAuth, requireStaff, async (req, res) => {
  const parsed = selectVenueSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const session = await issueVenueScopedSession(req.auth!.sub, parsed.data.venueId);
  if (!session) return res.status(403).json({ error: t(req.locale, "auth.noVenueAccess") });
  res.json(session);
});

authRouter.get("/staff/venues", requireAuth, requireStaff, async (req, res) => {
  const memberships = await prisma.staffVenueMembership.findMany({
    where: { staffAccountId: req.auth!.sub },
    include: { venue: { select: { id: true, name: true, status: true } } },
    orderBy: { createdAt: "asc" },
  });
  res.json(memberships.map((m) => ({ ...m.venue, role: m.role })));
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().email().transform((v) => v.toLowerCase()),
  kind: z.enum(["user", "staff"]),
});

authRouter.post("/forgot-password", authRateLimit, async (req, res) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, kind } = parsed.data;

  const account =
    kind === "user"
      ? await prisma.user.findUnique({ where: { email } })
      : await prisma.staffAccount.findUnique({ where: { email } });

  // Same response whether or not the account exists, so this can't be used to enumerate emails.
  if (account) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    await prisma.passwordResetToken.create({
      data: {
        accountType: kind,
        accountId: account.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    const resetUrl = `https://velvet-network.app/reset-password?token=${rawToken}&kind=${kind}`;
    sendPasswordResetEmail(email, resetUrl, kind, req.locale).catch((err) => console.error("Failed to send reset email", err));
  }

  res.json({ ok: true });
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  kind: z.enum(["user", "staff"]),
  password: z.string().min(8),
});

authRouter.post("/reset-password", authRateLimit, async (req, res) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { token, kind, password } = parsed.data;

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!resetToken || resetToken.accountType !== kind || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return res.status(400).json({ error: t(req.locale, "auth.linkInvalidOrExpired") });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  if (kind === "user") {
    await prisma.user.update({ where: { id: resetToken.accountId }, data: { passwordHash } });
  } else {
    await prisma.staffAccount.update({ where: { id: resetToken.accountId }, data: { passwordHash } });
  }

  await prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } });

  res.json({ ok: true });
});
