import { Router } from "express";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth, requireUser } from "../middleware/auth";
import { t } from "../lib/i18n";
import { getOrCreateInviteCode } from "../lib/invite-code";

export const invitesRouter = Router();

function generateInviteCode(): string {
  return crypto.randomBytes(6).toString("base64url");
}

invitesRouter.get("/me", requireAuth, requireUser, async (req, res) => {
  const invite = await getOrCreateInviteCode(req.auth!.sub);
  res.json({ code: invite.code });
});

invitesRouter.post("/me/rotate", requireAuth, requireUser, async (req, res) => {
  const userId = req.auth!.sub;
  let code = generateInviteCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const clash = await prisma.userInviteCode.findUnique({ where: { code } });
    if (!clash) break;
    code = generateInviteCode();
  }

  const invite = await prisma.userInviteCode.upsert({
    where: { userId },
    create: { userId, code },
    update: { code },
  });
  res.json({ code: invite.code });
});

invitesRouter.get("/:code", requireAuth, requireUser, async (req, res) => {
  const invite = await prisma.userInviteCode.findUnique({
    where: { code: req.params.code },
    include: { user: { select: { id: true, firstName: true, photoUrl: true } } },
  });
  if (!invite) return res.status(404).json({ error: t(req.locale, "invites.codeNotFound") });
  if (invite.userId === req.auth!.sub) return res.status(400).json({ error: t(req.locale, "invites.cannotUseOwnCode") });

  res.json({ userId: invite.user.id, displayName: invite.user.firstName, photoUrl: invite.user.photoUrl });
});

invitesRouter.post("/:code/request", requireAuth, requireUser, async (req, res) => {
  const inviteeId = req.auth!.sub;

  const invite = await prisma.userInviteCode.findUnique({ where: { code: req.params.code } });
  if (!invite) return res.status(404).json({ error: t(req.locale, "invites.codeNotFound") });

  const inviterId = invite.userId;
  if (inviterId === inviteeId) return res.status(400).json({ error: t(req.locale, "invites.cannotUseOwnCode") });

  const existing = await prisma.connectionRequest.findUnique({
    where: { inviterId_inviteeId: { inviterId, inviteeId } },
  });
  if (existing?.status === "ACCEPTED") return res.json({ status: "ACCEPTED" });

  const request = await prisma.connectionRequest.upsert({
    where: { inviterId_inviteeId: { inviterId, inviteeId } },
    create: { inviterId, inviteeId },
    update: { status: "PENDING", respondedAt: null },
  });
  res.status(201).json({ status: request.status });
});

invitesRouter.get("/requests/incoming", requireAuth, requireUser, async (req, res) => {
  const requests = await prisma.connectionRequest.findMany({
    where: { inviterId: req.auth!.sub, status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: { invitee: { select: { id: true, firstName: true, photoUrl: true } } },
  });

  res.json(
    requests.map((r) => ({
      id: r.id,
      userId: r.invitee.id,
      displayName: r.invitee.firstName,
      photoUrl: r.invitee.photoUrl,
      createdAt: r.createdAt,
    }))
  );
});

const respondSchema = z.object({ requestId: z.string().min(1) });

invitesRouter.post("/requests/accept", requireAuth, requireUser, async (req, res) => {
  const parsed = respondSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const request = await prisma.connectionRequest.findUnique({ where: { id: parsed.data.requestId } });
  if (!request || request.inviterId !== req.auth!.sub) {
    return res.status(404).json({ error: t(req.locale, "invites.requestNotFound") });
  }

  await prisma.connectionRequest.update({
    where: { id: request.id },
    data: { status: "ACCEPTED", respondedAt: new Date() },
  });
  res.json({ ok: true });
});

invitesRouter.post("/requests/decline", requireAuth, requireUser, async (req, res) => {
  const parsed = respondSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const request = await prisma.connectionRequest.findUnique({ where: { id: parsed.data.requestId } });
  if (!request || request.inviterId !== req.auth!.sub) {
    return res.status(404).json({ error: t(req.locale, "invites.requestNotFound") });
  }

  await prisma.connectionRequest.update({
    where: { id: request.id },
    data: { status: "DECLINED", respondedAt: new Date() },
  });
  res.json({ ok: true });
});
