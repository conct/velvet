import { colors, fonts, type BillingInterval, type PremiumStatus, type SubscriptionProvider } from "@velvet/shared";
import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Card, Divider, GoldButton, Heading, Label, Screen } from "../../components/ui";
import { ApiError, apiFetch } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import { useLocale } from "../../lib/locale-context";

// Display copy only -- must match the prices configured on the actual
// Stripe price / PayPal plan (server/.env STRIPE_PRICE_ID_* / PAYPAL_PLAN_ID_*).
const PLAN_PRICING: Record<BillingInterval, { price: string; per: string; hasBadge?: boolean }> = {
  MONTH: { price: "24,99 €", per: "/ Monat" },
  YEAR: { price: "199 €", per: "/ Jahr", hasBadge: true },
};

async function openCheckoutUrl(url: string) {
  if (Platform.OS === "web") {
    window.location.href = url;
  } else {
    await WebBrowser.openBrowserAsync(url);
  }
}

export default function Premium() {
  const { token } = useAuth();
  const { t } = useLocale();
  const [status, setStatus] = useState<PremiumStatus | null>(null);
  const [interval, setInterval] = useState<BillingInterval>("MONTH");
  const [loadingProvider, setLoadingProvider] = useState<SubscriptionProvider | null>(null);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = async () => {
    if (!token) return;
    try {
      const result = await apiFetch<PremiumStatus>("/subscriptions/me", { token });
      setStatus(result);
    } catch {
      setError(t.mobile.premium.statusLoadFailed);
    }
  };

  useEffect(() => {
    loadStatus();
  }, [token]);

  const startCheckout = async (provider: SubscriptionProvider) => {
    if (!token) return;
    setError(null);
    setLoadingProvider(provider);
    try {
      const { checkoutUrl } = await apiFetch<{ checkoutUrl: string }>("/subscriptions/checkout", {
        method: "POST",
        token,
        body: { provider, interval },
      });
      await openCheckoutUrl(checkoutUrl);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t.mobile.premium.checkoutFailed);
    } finally {
      setLoadingProvider(null);
    }
  };

  const cancelSubscription = async () => {
    if (!token) return;
    setCanceling(true);
    setError(null);
    try {
      await apiFetch("/subscriptions/cancel", { method: "POST", token });
      await loadStatus();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t.mobile.premium.cancelFailed);
    } finally {
      setCanceling(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← {t.mobile.premium.back}</Text>
        </Pressable>
        <Heading>{t.mobile.premium.title}</Heading>
        <Text style={styles.subtitle}>{t.mobile.premium.subtitle}</Text>

        {status?.isPremium && status.subscription ? (
          <Card style={styles.card}>
            <Label muted>{t.mobile.premium.activeSubscription}</Label>
            <Text style={styles.statusLine}>
              {status.subscription.provider === "STRIPE"
                ? "Stripe"
                : status.subscription.provider === "PAYPAL"
                  ? "PayPal"
                  : t.mobile.premium.providerGranted}{" "}
              ·{" "}
              {status.subscription.interval === "MONTH" ? t.mobile.premium.monthly : t.mobile.premium.yearly}
            </Text>
            <Text style={styles.renewal}>
              {status.subscription.cancelAtPeriodEnd ? `${t.mobile.premium.expiresOn} ` : `${t.mobile.premium.renewsOn} `}
              {new Date(status.subscription.currentPeriodEnd).toLocaleDateString("de-DE")}
            </Text>
            {!status.subscription.cancelAtPeriodEnd && (
              <View style={{ marginTop: 16 }}>
                <GoldButton title={t.mobile.premium.cancelButton} variant="outline" onPress={cancelSubscription} loading={canceling} />
              </View>
            )}
          </Card>
        ) : (
          <>
            <View style={styles.planRow}>
              {(["MONTH", "YEAR"] as BillingInterval[]).map((option) => {
                const plan = PLAN_PRICING[option];
                const active = interval === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => setInterval(option)}
                    style={[styles.planCard, active && styles.planCardActive]}
                  >
                    {plan.hasBadge && (
                      <View style={styles.planBadge}>
                        <Text style={styles.planBadgeText}>{t.mobile.premium.saveBadge}</Text>
                      </View>
                    )}
                    <Text style={[styles.planLabel, active && styles.planLabelActive]}>
                      {option === "MONTH" ? t.mobile.premium.monthly : t.mobile.premium.yearly}
                    </Text>
                    <Text style={[styles.planPrice, active && styles.planPriceActive]}>{plan.price}</Text>
                    <Text style={[styles.planPer, active && styles.planPerActive]}>{plan.per}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ marginTop: 24, gap: 12 }}>
              <GoldButton
                title={`${t.mobile.premium.subscribeWithStripe} · ${PLAN_PRICING[interval].price}${PLAN_PRICING[interval].per}`}
                onPress={() => startCheckout("STRIPE")}
                loading={loadingProvider === "STRIPE"}
                disabled={loadingProvider !== null}
              />
              <GoldButton
                title={`${t.mobile.premium.subscribeWithPaypal} · ${PLAN_PRICING[interval].price}${PLAN_PRICING[interval].per}`}
                variant="outline"
                onPress={() => startCheckout("PAYPAL")}
                loading={loadingProvider === "PAYPAL"}
                disabled={loadingProvider !== null}
              />
            </View>

            <View style={styles.featureList}>
              {t.mobile.premium.features.map((feature) => (
                <View key={feature.title} style={styles.featureCard}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureBody}>{feature.body}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        <Divider />
        <Text style={styles.note}>{t.mobile.premium.paymentNote}</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, paddingBottom: 60 },
  back: { fontFamily: fonts.bodyMedium, color: colors.gold, fontSize: 14, marginBottom: 16 },
  subtitle: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 14, lineHeight: 20, marginTop: 10 },
  card: { marginTop: 24 },
  statusLine: { fontFamily: fonts.heading, color: colors.gold, fontSize: 18, marginTop: 6 },
  renewal: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 13, marginTop: 6 },
  planRow: { flexDirection: "row", gap: 12, marginTop: 24 },
  planCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    backgroundColor: colors.surface,
  },
  planCardActive: { borderColor: colors.gold, backgroundColor: colors.surfaceRaised },
  planBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.gold,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 8,
  },
  planBadgeText: { fontFamily: fonts.bodySemiBold, color: colors.background, fontSize: 10 },
  planLabel: { fontFamily: fonts.bodyMedium, color: colors.textMuted, fontSize: 13 },
  planLabelActive: { color: colors.text },
  planPrice: { fontFamily: fonts.heading, color: colors.text, fontSize: 24, marginTop: 6 },
  planPriceActive: { color: colors.gold },
  planPer: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 12, marginTop: 2 },
  planPerActive: { color: colors.textMuted },
  error: { fontFamily: fonts.body, color: colors.danger, fontSize: 13, marginTop: 16 },
  note: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  featureList: { marginTop: 28, gap: 12 },
  featureCard: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    backgroundColor: colors.surface,
  },
  featureIcon: { fontSize: 18, color: colors.gold, width: 22, textAlign: "center", marginTop: 1 },
  featureTitle: { fontFamily: fonts.bodySemiBold, color: colors.text, fontSize: 14 },
  featureBody: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 13, lineHeight: 18, marginTop: 3 },
});
