import rateLimit from "express-rate-limit";
import type { Request } from "express";
import { t } from "../lib/i18n";

// Guards login/registration/password-reset endpoints against brute force and
// credential stuffing. Keyed by IP (express-rate-limit's default) -- these
// endpoints run before requireAuth, so there's no account identity to key on
// yet.
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: (req: Request) => ({ error: t(req.locale, "auth.tooManyRequests") }),
});

// QR check-in codes are 6 digits with a 90s TTL, already a small enough
// window that brute-forcing one is impractical even unthrottled -- this is
// defense-in-depth against a compromised/malicious staff account trying to
// guess an active code fast rather than the primary control.
export const qrVerifyRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: (req: Request) => ({ error: t(req.locale, "auth.tooManyRequests") }),
});

// The public venue-application form is unauthenticated and accepts a file
// upload, so it's the one endpoint where an anonymous caller can write to
// disk. Deliberately much tighter than authRateLimit: a real bar owner fills
// this in once, never five times an hour.
export const venueApplicationRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: (req: Request) => ({ error: t(req.locale, "auth.tooManyRequests") }),
});
