import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { t } from "../lib/i18n";

export interface AuthClaims {
  sub: string;
  type: "user" | "staff" | "staff-pending-venue";
  venueId?: string;
  role?: "DOORMAN" | "MANAGER";
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

export function requireManager(req: Request, res: Response, next: NextFunction) {
  if (req.auth?.type !== "staff" || req.auth.role !== "MANAGER") {
    return res.status(403).json({ error: t(req.locale, "auth.managerOnly") });
  }
  next();
}

export function requirePlatformAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.auth?.type !== "staff" || !req.auth.isPlatformAdmin) {
    return res.status(403).json({ error: t(req.locale, "auth.platformAdminOnly") });
  }
  next();
}
