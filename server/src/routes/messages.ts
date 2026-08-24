import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth, requireManager, requireUser } from "../middleware/auth";
import { isPremium } from "../lib/premium";
import { canMessage, canStaffMessage, findSharedNightCandidates } from "../lib/messaging";
import { getUserTrust } from "../lib/trust";
import { t } from "../lib/i18n";
import { mirrorMessageAsEmail } from "../lib/relay";

export const messagesRouter = Router();

messagesRouter.get("/eligible", requireAuth, requireUser, async (req, res) => {
  const userId = req.auth!.sub;

  if (!(await isPremium(userId))) {
    return res.json({ isPremium: false, matches: [] });
  }

  const candidates = await findSharedNightCandidates(userId);
  if (candidates.length === 0) return res.json({ isPremium: true, matches: [] });

  const candidateIds = candidates.map((c) => c.userId);
  const [premiumSubs, blocks, profiles] = await Promise.all([
    prisma.subscription.findMany({
      where: { userId: { in: candidateIds }, status: "ACTIVE", currentPeriodEnd: { gt: new Date() } },
      select: { userId: true },
    }),
    prisma.blockedUser.findMany({
      where: {
        OR: [
          { blockerId: userId, blockedId: { in: candidateIds } },
          { blockedId: userId, blockerId: { in: candidateIds } },
        ],
      },
      select: { blockerId: true, blockedId: true },
    }),
    prisma.user.findMany({
      where: { id: { in: candidateIds } },
      select: { id: true, firstName: true, photoUrl: true },
    }),
  ]);

  const premiumIds = new Set(premiumSubs.map((s) => s.userId));
  const blockedIds = new Set(blocks.map((b) => (b.blockerId === userId ? b.blockedId : b.blockerId)));
  const profileById = new Map(profiles.map((p) => [p.id, p]));

  const matches = candidates
    .filter((c) => premiumIds.has(c.userId) && !blockedIds.has(c.userId))
    .map((c) => {
      const profile = profileById.get(c.userId)!;
      return {
        userId: c.userId,
        displayName: profile.firstName,
        photoUrl: profile.photoUrl,
        venueName: c.venueName,
        sharedAt: c.sharedAt,
      };
    });

  res.json({ isPremium: true, matches });
});

messagesRouter.get("/threads", requireAuth, requireUser, async (req, res) => {
  const userId = req.auth!.sub;

  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: userId }, { recipientId: userId }] },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, firstName: true, photoUrl: true } },
      recipient: { select: { id: true, firstName: true, photoUrl: true } },
      senderStaffAccount: { select: { id: true, name: true } },
      recipientStaffAccount: { select: { id: true, name: true } },
    },
  });

  const threads = new Map<
    string,
    { userId: string | null; staffAccountId: string | null; displayName: string; photoUrl: string | null; lastMessage: string; lastMessageAt: Date; unreadCount: number }
  >();

  for (const m of messages) {
    const isMine = m.senderId === userId;
    const counterpartUser = isMine ? m.recipient : m.sender;
    const counterpartStaff = isMine ? m.recipientStaffAccount : m.senderStaffAccount;
    const key = counterpartUser?.id ?? `staff:${counterpartStaff!.id}`;

    const existing = threads.get(key);
    if (!existing) {
      threads.set(key, {
        userId: counterpartUser?.id ?? null,
        staffAccountId: counterpartStaff?.id ?? null,
        displayName: counterpartUser?.firstName ?? counterpartStaff!.name,
        photoUrl: counterpartUser?.photoUrl ?? null,
        lastMessage: m.body,
        lastMessageAt: m.createdAt,
        unreadCount: m.recipientId === userId && !m.readAt ? 1 : 0,
      });
    } else if (m.recipientId === userId && !m.readAt) {
      existing.unreadCount += 1;
    }
  }

  res.json([...threads.values()]);
});

messagesRouter.get("/thread/:userId", requireAuth, requireUser, async (req, res) => {
  const userId = req.auth!.sub;
  const counterpartId = req.params.userId;

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, recipientId: counterpartId },
        { senderId: counterpartId, recipientId: userId },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  await prisma.message.updateMany({
    where: { senderId: counterpartId, recipientId: userId, readAt: null },
    data: { readAt: new Date() },
  });

  res.json(messages);
});

const sendMessageSchema = z.object({ body: z.string().trim().min(1).max(2000) });

messagesRouter.post("/thread/:userId", requireAuth, requireUser, async (req, res) => {
  const userId = req.auth!.sub;
  const counterpartId = req.params.userId;

  const parsed = sendMessageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  if (!(await canMessage(userId, counterpartId))) {
    return res.status(403).json({ error: t(req.locale, "messages.notEligiblePeer") });
  }

  const message = await prisma.message.create({
    data: { senderId: userId, recipientId: counterpartId, body: parsed.data.body },
  });
  res.status(201).json(message);
  void mirrorMessageAsEmail({ senderId: userId, recipientId: counterpartId, body: parsed.data.body });
});

// Guest side of a staff-initiated conversation (e.g. a manager's invite).
// No canMessage() gate here -- the staff member already had to pass
// canStaffMessage() to start the thread, and a guest can always reply to
// something staff sent them.
messagesRouter.get("/thread/staff/:staffAccountId", requireAuth, requireUser, async (req, res) => {
  const userId = req.auth!.sub;
  const staffAccountId = req.params.staffAccountId;

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, recipientStaffAccountId: staffAccountId },
        { senderStaffAccountId: staffAccountId, recipientId: userId },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  await prisma.message.updateMany({
    where: { senderStaffAccountId: staffAccountId, recipientId: userId, readAt: null },
    data: { readAt: new Date() },
  });

  res.json(messages);
});

messagesRouter.post("/thread/staff/:staffAccountId", requireAuth, requireUser, async (req, res) => {
  const userId = req.auth!.sub;
  const staffAccountId = req.params.staffAccountId;

  const parsed = sendMessageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const priorMessage = await prisma.message.findFirst({
    where: { OR: [{ senderStaffAccountId: staffAccountId, recipientId: userId }, { senderId: userId, recipientStaffAccountId: staffAccountId }] },
  });
  if (!priorMessage) return res.status(403).json({ error: t(req.locale, "messages.noExistingStaffContact") });

  const message = await prisma.message.create({
    data: { senderId: userId, recipientStaffAccountId: staffAccountId, body: parsed.data.body },
  });
  res.status(201).json(message);
});

messagesRouter.post("/thread/:userId/block", requireAuth, requireUser, async (req, res) => {
  const userId = req.auth!.sub;
  const blockedId = req.params.userId;
  if (userId === blockedId) return res.status(400).json({ error: t(req.locale, "messages.cannotBlockSelf") });

  await prisma.blockedUser.upsert({
    where: { blockerId_blockedId: { blockerId: userId, blockedId } },
    create: { blockerId: userId, blockedId },
    update: {},
  });
  res.json({ ok: true });
});

const reportSchema = z.object({ reason: z.string().trim().min(1).max(500) });

messagesRouter.post("/:messageId/report", requireAuth, requireUser, async (req, res) => {
  const userId = req.auth!.sub;
  const parsed = reportSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const message = await prisma.message.findUnique({ where: { id: req.params.messageId } });
  if (!message || (message.senderId !== userId && message.recipientId !== userId)) {
    return res.status(404).json({ error: t(req.locale, "messages.notFound") });
  }

  await prisma.message.update({
    where: { id: message.id },
    data: { reportedAt: new Date(), reportReason: parsed.data.reason },
  });
  res.json({ ok: true });
});

// Manager-side: reach out to VIP/Premium guests of your own venue, e.g. to
// invite them to something. See canStaffMessage() for the exact eligibility
// rule (must have a recorded visit at this venue, plus VIP tier or Premium).
messagesRouter.get("/staff/eligible-guests", requireAuth, requireManager, async (req, res) => {
  const venueId = req.auth!.venueId!;

  const relationships = await prisma.venueRelationship.findMany({
    where: { venueId },
    include: { user: { select: { id: true, firstName: true, lastName: true, photoUrl: true } } },
  });

  const results = await Promise.all(
    relationships.map(async (r) => {
      const [{ tier }, premium] = await Promise.all([getUserTrust(r.userId), isPremium(r.userId)]);
      if (tier !== "VIP" && !premium) return null;
      return {
        userId: r.user.id,
        displayName: `${r.user.firstName} ${r.user.lastName.charAt(0)}.`,
        photoUrl: r.user.photoUrl,
        globalTier: tier,
        isPremium: premium,
      };
    })
  );

  res.json(results.filter((r): r is NonNullable<typeof r> => r !== null));
});

messagesRouter.get("/staff/threads", requireAuth, requireManager, async (req, res) => {
  const staffAccountId = req.auth!.sub;

  const messages = await prisma.message.findMany({
    where: { OR: [{ senderStaffAccountId: staffAccountId }, { recipientStaffAccountId: staffAccountId }] },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, firstName: true, photoUrl: true } },
      recipient: { select: { id: true, firstName: true, photoUrl: true } },
    },
  });

  const threads = new Map<
    string,
    { userId: string; displayName: string; photoUrl: string | null; lastMessage: string; lastMessageAt: Date; unreadCount: number }
  >();

  for (const m of messages) {
    const isMine = m.senderStaffAccountId === staffAccountId;
    const counterpart = isMine ? m.recipient! : m.sender!;

    const existing = threads.get(counterpart.id);
    if (!existing) {
      threads.set(counterpart.id, {
        userId: counterpart.id,
        displayName: counterpart.firstName,
        photoUrl: counterpart.photoUrl,
        lastMessage: m.body,
        lastMessageAt: m.createdAt,
        unreadCount: m.recipientStaffAccountId === staffAccountId && !m.readAt ? 1 : 0,
      });
    } else if (m.recipientStaffAccountId === staffAccountId && !m.readAt) {
      existing.unreadCount += 1;
    }
  }

  res.json([...threads.values()]);
});

messagesRouter.get("/staff/thread/:userId", requireAuth, requireManager, async (req, res) => {
  const staffAccountId = req.auth!.sub;
  const userId = req.params.userId;

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderStaffAccountId: staffAccountId, recipientId: userId },
        { senderId: userId, recipientStaffAccountId: staffAccountId },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  await prisma.message.updateMany({
    where: { senderId: userId, recipientStaffAccountId: staffAccountId, readAt: null },
    data: { readAt: new Date() },
  });

  res.json(messages);
});

messagesRouter.post("/staff/thread/:userId", requireAuth, requireManager, async (req, res) => {
  const staffAccountId = req.auth!.sub;
  const venueId = req.auth!.venueId!;
  const userId = req.params.userId;

  const parsed = sendMessageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  if (!(await canStaffMessage(venueId, userId))) {
    return res.status(403).json({ error: t(req.locale, "messages.notEligibleStaff") });
  }

  const message = await prisma.message.create({
    data: { senderStaffAccountId: staffAccountId, recipientId: userId, body: parsed.data.body },
  });
  res.status(201).json(message);
});
