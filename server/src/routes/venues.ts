import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth, requireManager, requireStaff } from "../middleware/auth";
import { getUserTrust } from "../lib/trust";
import { t } from "../lib/i18n";

export const venuesRouter = Router();

venuesRouter.get("/", async (_req, res) => {
  const venues = await prisma.venue.findMany({
    where: { status: "VERIFIED" },
    select: { id: true, name: true, address: true, logoUrl: true },
    orderBy: { name: "asc" },
  });
  res.json(venues);
});

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

const createVenueSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
});

venuesRouter.post("/", requireAuth, requireStaff, async (req, res) => {
  const parsed = createVenueSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { name, address } = parsed.data;

  const base = slugify(name);
  let slug = base;
  for (let i = 1; await prisma.venue.findUnique({ where: { slug } }); i++) {
    slug = `${base}-${i}`;
  }

  const venue = await prisma.venue.create({ data: { name, address, slug, status: "PENDING" } });
  await prisma.staffVenueMembership.create({
    data: { staffAccountId: req.auth!.sub, venueId: venue.id, role: "MANAGER" },
  });

  res.status(201).json(venue);
});

venuesRouter.get("/me", requireAuth, requireStaff, async (req, res) => {
  const venue = await prisma.venue.findUniqueOrThrow({ where: { id: req.auth!.venueId! } });
  res.json(venue);
});

const updateVenueSchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  logoUrl: z.string().url().nullable().optional(),
});

venuesRouter.patch("/me", requireAuth, requireManager, async (req, res) => {
  const parsed = updateVenueSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  if (Object.keys(parsed.data).length === 0) {
    return res.status(400).json({ error: t(req.locale, "venues.noChangesProvided") });
  }

  const venue = await prisma.venue.update({ where: { id: req.auth!.venueId! }, data: parsed.data });
  res.json(venue);
});

venuesRouter.get("/me/staff", requireAuth, requireManager, async (req, res) => {
  const memberships = await prisma.staffVenueMembership.findMany({
    where: { venueId: req.auth!.venueId },
    include: { staffAccount: { select: { id: true, email: true, name: true, createdAt: true } } },
    orderBy: { createdAt: "asc" },
  });
  res.json(
    memberships.map((m) => ({
      id: m.staffAccount.id,
      email: m.staffAccount.email,
      name: m.staffAccount.name,
      role: m.role,
      createdAt: m.staffAccount.createdAt,
    }))
  );
});

const createStaffSchema = z.object({
  email: z.string().trim().email().transform((v) => v.toLowerCase()),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.enum(["DOORMAN", "MANAGER"]),
});

venuesRouter.post("/me/staff", requireAuth, requireManager, async (req, res) => {
  const parsed = createStaffSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password, name, role } = parsed.data;

  const existing = await prisma.staffAccount.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: t(req.locale, "venues.emailAlreadyTaken") });

  const passwordHash = await bcrypt.hash(password, 10);
  const staff = await prisma.staffAccount.create({ data: { email, passwordHash, name } });
  await prisma.staffVenueMembership.create({
    data: { staffAccountId: staff.id, venueId: req.auth!.venueId!, role },
  });
  res.status(201).json({ id: staff.id, email: staff.email, name: staff.name, role });
});

venuesRouter.get("/me/guests", requireAuth, requireManager, async (req, res) => {
  const query = String(req.query.q ?? "").trim();
  const relationships = await prisma.venueRelationship.findMany({
    where: {
      venueId: req.auth!.venueId,
      ...(query
        ? {
            user: {
              OR: [
                { firstName: { contains: query } },
                { lastName: { contains: query } },
                { email: { contains: query } },
              ],
            },
          }
        : {}),
    },
    include: { user: { select: { id: true, firstName: true, lastName: true, email: true, photoUrl: true } } },
    orderBy: { lastVisitAt: "desc" },
    take: 50,
  });

  const withTrust = await Promise.all(
    relationships.map(async (r) => {
      const { tier, score } = await getUserTrust(r.user.id);
      return {
        userId: r.user.id,
        firstName: r.user.firstName,
        lastName: r.user.lastName,
        email: r.user.email,
        photoUrl: r.user.photoUrl,
        visits: r.visits,
        lastVisitAt: r.lastVisitAt,
        localFlag: r.localFlag,
        privateNote: r.privateNote,
        globalTier: tier,
        globalScore: Number(score.toFixed(2)),
      };
    })
  );

  res.json(withTrust);
});
