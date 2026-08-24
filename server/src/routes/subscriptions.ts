import { NextFunction, Request, Response, Router } from "express";
import { z } from "zod";
import type Stripe from "stripe";
import { prisma } from "../db";
import { requireAuth, requireUser } from "../middleware/auth";
import { getPremiumStatus } from "../lib/premium";
import { LOCALES, WITHDRAWAL_CONSENT_TEXT, WITHDRAWAL_CONSENT_VERSION, type Locale } from "@velvet/shared";
import { t } from "../lib/i18n";
import * as stripe from "../lib/payments/stripe";
import * as paypal from "../lib/payments/paypal";

export const subscriptionsRouter = Router();

subscriptionsRouter.get("/me", requireAuth, requireUser, async (req, res) => {
  const { isPremium, subscription } = await getPremiumStatus(req.auth!.sub);
  res.json({
    isPremium,
    subscription: subscription
      ? {
          provider: subscription.provider,
          status: subscription.status,
          interval: subscription.interval,
          currentPeriodEnd: subscription.currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        }
      : null,
  });
});

const checkoutSchema = z.object({
  provider: z.enum(["STRIPE", "PAYPAL"]),
  interval: z.enum(["MONTH", "YEAR"]),
  // Zustimmung zum sofortigen Beginn plus Bestätigung, das Widerrufsrecht
  // dadurch zu verlieren (§ 356 Abs. 5 BGB). Beides steckt in einer einzigen
  // Pflicht-Checkbox, deren Wortlaut in WITHDRAWAL_CONSENT_TEXT steht.
  withdrawalConsent: z.boolean(),
  // Sprachfassung, in der die Checkbox angezeigt wurde -- protokolliert wird
  // der Text, den die Person tatsächlich gelesen hat, nicht die deutsche
  // Fassung als Ersatz dafür.
  consentLocale: z.enum(LOCALES as [Locale, ...Locale[]]).optional(),
});

subscriptionsRouter.post("/checkout", requireAuth, requireUser, async (req, res) => {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { provider, interval, withdrawalConsent } = parsed.data;
  const userId = req.auth!.sub;

  if (!withdrawalConsent) {
    return res.status(400).json({ error: t(req.locale, "subscriptions.withdrawalConsentRequired"), code: "WITHDRAWAL_CONSENT_REQUIRED" });
  }

  // Vor dem Weiterleiten zum Zahlungsdienstleister festgehalten: die
  // Erklärung ist mit dem Klick abgegeben, unabhängig davon, ob der Checkout
  // danach durchläuft oder abgebrochen wird.
  const consentLocale = parsed.data.consentLocale ?? (req.locale as Locale);
  await prisma.withdrawalConsent.create({
    data: {
      userId,
      provider,
      interval,
      version: WITHDRAWAL_CONSENT_VERSION,
      locale: consentLocale,
      text: WITHDRAWAL_CONSENT_TEXT[consentLocale],
    },
  });

  try {
    const checkoutUrl =
      provider === "STRIPE"
        ? await stripe.createCheckoutSession(userId, interval)
        : await paypal.createSubscription(userId, interval);
    res.json({ checkoutUrl });
  } catch (err) {
    res.status(502).json({ error: err instanceof Error ? err.message : t(req.locale, "subscriptions.checkoutFailed") });
  }
});

subscriptionsRouter.post("/cancel", requireAuth, requireUser, async (req, res) => {
  const { subscription } = await getPremiumStatus(req.auth!.sub);
  if (!subscription) return res.status(404).json({ error: t(req.locale, "subscriptions.noActiveSubscription") });

  if (subscription.provider === "STRIPE") {
    await stripe.cancelSubscriptionAtPeriodEnd(subscription.providerSubId);
  } else if (subscription.provider === "PAYPAL") {
    await paypal.cancelSubscription(subscription.providerSubId);
  }
  // COMPED grants have no external provider to cancel — just flip the DB flag below.

  await prisma.subscription.update({ where: { id: subscription.id }, data: { cancelAtPeriodEnd: true } });
  res.json({ ok: true });
});

async function upsertFromStripeSubscription(sub: Stripe.Subscription, userId: string) {
  await prisma.subscription.upsert({
    where: { providerSubId: sub.id },
    create: {
      userId,
      provider: "STRIPE",
      providerCustomerId: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
      providerSubId: sub.id,
      status: stripe.mapStripeStatus(sub.status),
      interval: stripe.intervalFromPriceId(stripe.getPriceId(sub)),
      currentPeriodEnd: stripe.getCurrentPeriodEnd(sub),
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    },
    update: {
      status: stripe.mapStripeStatus(sub.status),
      currentPeriodEnd: stripe.getCurrentPeriodEnd(sub),
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    },
  });
}

// Mounted directly on the app before express.json() — Stripe's signature
// verification needs the raw request body, not the parsed JSON.
export async function stripeWebhookHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const signature = req.headers["stripe-signature"];
    if (typeof signature !== "string") return res.status(400).json({ error: "Fehlende Signatur" });

    const event = stripe.constructWebhookEvent(req.body as Buffer, signature);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        if (userId && typeof session.subscription === "string") {
          const sub = await stripe.retrieveSubscription(session.subscription);
          await upsertFromStripeSubscription(sub, userId);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (userId) await upsertFromStripeSubscription(sub, userId);
        break;
      }
      default:
        break;
    }

    res.json({ received: true });
  } catch (err) {
    next(err);
  }
}

subscriptionsRouter.post("/webhook/paypal", async (req, res) => {
  const verified = await paypal.verifyWebhookSignature(req.headers as Record<string, string | undefined>, req.body);
  if (!verified) return res.status(400).json({ error: "Signatur ungültig" });

  const event = req.body as { event_type: string; resource: { id: string; custom_id?: string; status: string } };
  const { event_type: eventType, resource } = event;

  if (
    eventType === "BILLING.SUBSCRIPTION.ACTIVATED" ||
    eventType === "BILLING.SUBSCRIPTION.UPDATED" ||
    eventType === "BILLING.SUBSCRIPTION.CANCELLED"
  ) {
    const existing = await prisma.subscription.findUnique({ where: { providerSubId: resource.id } });
    const userId = resource.custom_id ?? existing?.userId;
    if (userId) {
      const details = await paypal.getSubscriptionDetails(resource.id);
      const nextBilling = details.billing_info?.next_billing_time;
      await prisma.subscription.upsert({
        where: { providerSubId: resource.id },
        create: {
          userId,
          provider: "PAYPAL",
          providerSubId: resource.id,
          status: paypal.mapPaypalStatus(details.status),
          interval: paypal.intervalFromPlanId(details.plan_id),
          currentPeriodEnd: nextBilling ? new Date(nextBilling) : new Date(),
          cancelAtPeriodEnd: details.status === "CANCELLED",
        },
        update: {
          status: paypal.mapPaypalStatus(details.status),
          ...(nextBilling ? { currentPeriodEnd: new Date(nextBilling) } : {}),
          cancelAtPeriodEnd: details.status === "CANCELLED",
        },
      });
    }
  }

  res.json({ received: true });
});
