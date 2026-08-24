import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { canManageVenue, canScanAndRate, type StaffRole } from "@velvet/shared";
import { t } from "../lib/i18n";

export interface AuthClaims {
  sub: string;
  type: "user" | "staff" | "staff-pending-venue";
  venueId?: string;
  role?: StaffRole;
  isPlatformAdmin?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthClaims;
    }
  }
}

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: t(req.locale, "auth.notAuthenticated") });
  try {
    const claims = jwt.verify(token, process.env.JWT_SECRET!, { algorithms: ["HS256"] }) as AuthClaims;
    req.auth = claims;
    next();
  } catch {
    return res.status(401).json({ error: t(req.locale, "auth.invalidToken") });
  }
}

export function requireUser(req: Request, res: Response, next: NextFunction) {
  if (req.auth?.type !== "user") return res.status(403).json({ error: t(req.locale, "auth.guestOnly") });
  next();
}

export function requireStaff(req: Request, res: Response, next: NextFunction) {
  if (req.auth?.type !== "staff") return res.status(403).json({ error: t(req.locale, "auth.staffOnly") });
  next();
}

// Venue administration (team, settings, guest list, guest messaging). Only
// MANAGER passes -- DOORMAN and SERVICE are door-level roles.
export function requireManager(req: Request, res: Response, next: NextFunction) {
  if (req.auth?.type !== "staff" || !req.auth.role || !canManageVenue(req.auth.role)) {
    return res.status(403).json({ error: t(req.locale, "auth.managerOnly") });
  }
  next();
}

// Door-level work: scanning a guest QR and rating the visit. Every current
// staff role may do this, but gating it explicitly (instead of on
// requireStaff alone) keeps the capability tied to the role table in
// packages/shared/src/types.ts rather than to "is logged in as staff".
export function requireScanner(req: Request, res: Response, next: NextFunction) {
  if (req.auth?.type !== "staff" || !req.auth.role || !canScanAndRate(req.auth.role)) {
    return res.status(403).json({ error: t(req.locale, "auth.scanNotAllowed") });
  }
  next();
}

export function requirePlatformAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.auth?.type !== "staff" || !req.auth.isPlatformAdmin) {
    return res.status(403).json({ error: t(req.locale, "auth.platformAdminOnly") });
  }
  next();
}
