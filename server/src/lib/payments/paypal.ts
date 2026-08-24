// Hand-rolled REST client instead of @paypal/checkout-server-sdk, which is
// widely considered awkward for this flow. Mirrors the lean-dependency
// style already used for QR signing in packages/shared/src/qr.ts.

function baseUrl(): string {
  return process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
  const res = await fetch(`${baseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error("PayPal-Zugriffstoken konnte nicht abgerufen werden");
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

function planIdFor(interval: "MONTH" | "YEAR"): string {
  return interval === "MONTH" ? process.env.PAYPAL_PLAN_ID_MONTHLY! : process.env.PAYPAL_PLAN_ID_YEARLY!;
}

export async function createSubscription(userId: string, interval: "MONTH" | "YEAR"): Promise<string> {
  const accessToken = await getAccessToken();
  const webAppUrl = process.env.WEB_APP_URL!;
  const res = await fetch(`${baseUrl()}/v1/billing/subscriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      plan_id: planIdFor(interval),
      custom_id: userId,
      application_context: {
        return_url: `${webAppUrl}/premium/success`,
        cancel_url: `${webAppUrl}/premium/cancel`,
      },
    }),
  });
  if (!res.ok) throw new Error("PayPal-Abo konnte nicht erstellt werden");
  const data = (await res.json()) as { links: { rel: string; href: string }[] };
  const approveLink = data.links.find((l) => l.rel === "approve");
  if (!approveLink) throw new Error("PayPal hat keinen Freigabe-Link zurückgegeben");
  return approveLink.href;
}

export async function cancelSubscription(providerSubId: string): Promise<void> {
  const accessToken = await getAccessToken();
  const res = await fetch(`${baseUrl()}/v1/billing/subscriptions/${providerSubId}/cancel`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ reason: "Nutzer hat gekündigt" }),
  });
  if (!res.ok && res.status !== 204) throw new Error("PayPal-Abo konnte nicht gekündigt werden");
}

export async function getSubscriptionDetails(
  providerSubId: string
): Promise<{ status: string; plan_id: string; billing_info?: { next_billing_time?: string } }> {
  const accessToken = await getAccessToken();
  const res = await fetch(`${baseUrl()}/v1/billing/subscriptions/${providerSubId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("PayPal-Abo-Details konnten nicht abgerufen werden");
  return (await res.json()) as { status: string; plan_id: string; billing_info?: { next_billing_time?: string } };
}

export async function verifyWebhookSignature(
  headers: Record<string, string | undefined>,
  body: unknown
): Promise<boolean> {
  const accessToken = await getAccessToken();
  const res = await fetch(`${baseUrl()}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_algo: headers["paypal-auth-algo"],
      cert_url: headers["paypal-cert-url"],
      transmission_id: headers["paypal-transmission-id"],
      transmission_sig: headers["paypal-transmission-sig"],
      transmission_time: headers["paypal-transmission-time"],
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      webhook_event: body,
    }),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { verification_status: string };
  return data.verification_status === "SUCCESS";
}

export function intervalFromPlanId(planId: string): "MONTH" | "YEAR" {
  return planId === process.env.PAYPAL_PLAN_ID_YEARLY ? "YEAR" : "MONTH";
}

export function mapPaypalStatus(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "ACTIVE";
    case "SUSPENDED":
      return "PAST_DUE";
    case "CANCELLED":
    case "EXPIRED":
      return "CANCELED";
    default:
      return "INCOMPLETE";
  }
}
