import Stripe from "stripe";

let client: Stripe | null = null;

function getClient(): Stripe {
  if (!client) client = new Stripe(process.env.STRIPE_SECRET_KEY!);
  return client;
}

function priceIdFor(interval: "MONTH" | "YEAR"): string {
  return interval === "MONTH" ? process.env.STRIPE_PRICE_ID_MONTHLY! : process.env.STRIPE_PRICE_ID_YEARLY!;
}

export async function createCheckoutSession(userId: string, interval: "MONTH" | "YEAR"): Promise<string> {
  const webAppUrl = process.env.WEB_APP_URL!;
  const session = await getClient().checkout.sessions.create({
    mode: "subscription",
    client_reference_id: userId,
    subscription_data: { metadata: { userId } },
    line_items: [{ price: priceIdFor(interval), quantity: 1 }],
    success_url: `${webAppUrl}/premium/success`,
    cancel_url: `${webAppUrl}/premium/cancel`,
    // Managed Payments requires a tax code per product; VELVET handles its
    // own tax/compliance rather than opting into Stripe's merchant-of-record
    // flow, so this is explicitly disabled instead of configuring tax codes.
    managed_payments: { enabled: false },
  });
  if (!session.url) throw new Error("Stripe hat keine Checkout-URL zurückgegeben");
  return session.url;
}

export async function retrieveSubscription(id: string): Promise<Stripe.Subscription> {
  return getClient().subscriptions.retrieve(id);
}

export function intervalFromPriceId(priceId: string): "MONTH" | "YEAR" {
  return priceId === process.env.STRIPE_PRICE_ID_YEARLY ? "YEAR" : "MONTH";
}

// Stripe moved current_period_end/current_period_start onto the
// subscription item (not the subscription itself) in newer API versions,
// since a subscription can have multiple items with different cycles.
// VELVET subscriptions only ever have one item, so the first is authoritative.
export function getCurrentPeriodEnd(subscription: Stripe.Subscription): Date {
  return new Date(subscription.items.data[0].current_period_end * 1000);
}

export function getPriceId(subscription: Stripe.Subscription): string {
  return subscription.items.data[0].price.id;
}

export function constructWebhookEvent(rawBody: Buffer, signature: string): Stripe.Event {
  return getClient().webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
}

export async function cancelSubscriptionAtPeriodEnd(providerSubId: string): Promise<void> {
  await getClient().subscriptions.update(providerSubId, { cancel_at_period_end: true });
}

export function mapStripeStatus(status: Stripe.Subscription.Status): string {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "past_due":
    case "unpaid":
      return "PAST_DUE";
    case "canceled":
    case "incomplete_expired":
      return "CANCELED";
    default:
      return "INCOMPLETE";
  }
}
