import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { authRouter } from "./routes/auth";
import { usersRouter } from "./routes/users";
import { venuesRouter } from "./routes/venues";
import { qrRouter } from "./routes/qr";
import { ratingsRouter } from "./routes/ratings";
import { subscriptionsRouter, stripeWebhookHandler } from "./routes/subscriptions";
import { messagesRouter } from "./routes/messages";
import { adminRouter } from "./routes/admin";
import { invitesRouter } from "./routes/invites";
import { localeMiddleware } from "./lib/i18n";

// Only the actual browser-facing VELVET clients need cross-origin access;
// native mobile requests don't send an Origin header at all and are
// unaffected either way. Kept as an explicit allowlist rather than the
// account-wide `*` previously set at the Uberspace proxy layer (see
// docs/deployment.md) -- that wildcard is being removed to make this the
// one place CORS is actually decided.
const ALLOWED_ORIGINS = [
  "https://velvet-network.app",
  "https://web.velvet-network.app",
  "https://velvet.feif.space",
  "https://velvet-app.feif.space",
  "http://localhost:3000",
  "http://localhost:8081",
];

const app = express();
// Uberspace terminates TLS and proxies to this process, setting
// X-Forwarded-For itself -- without this, express-rate-limit can't tell a
// real client IP from a spoofed header and refuses to enforce limits at all
// (ERR_ERL_UNEXPECTED_X_FORWARDED_FOR), silently letting every rate-limited
// route through unthrottled. `1` trusts exactly the one hop Uberspace adds.
app.set("trust proxy", 1);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      callback(new Error("CORS_NOT_ALLOWED"));
    },
  })
);
// Without this, a blocked origin falls through to Express's default error
// handler and gets a bare 500 -- harmless to the caller (the browser still
// enforces CORS either way) but noisy/misleading in server logs.
app.use((err: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.message === "CORS_NOT_ALLOWED") return res.status(403).json({ error: "Origin not allowed" });
  next(err);
});

// Stripe webhook signature verification needs the raw request body, so this
// must be registered before the global JSON parser below.
app.post("/subscriptions/webhook/stripe", express.raw({ type: "application/json" }), stripeWebhookHandler);

app.use(express.json());
app.use(localeMiddleware);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (_req, res) => res.redirect("/health"));
app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/venues", venuesRouter);
app.use("/qr", qrRouter);
app.use("/ratings", ratingsRouter);
app.use("/subscriptions", subscriptionsRouter);
app.use("/messages", messagesRouter);
app.use("/admin", adminRouter);
app.use("/invites", invitesRouter);

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`VELVET API läuft auf http://localhost:${port}`);
});
