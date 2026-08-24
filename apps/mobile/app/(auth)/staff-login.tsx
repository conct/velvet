import { colors, fonts, radii } from "@velvet/shared";
import type { VenueSummary } from "@velvet/shared";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { GoldButton, Heading, Input, LanguageSwitcher, PasswordInput, Screen } from "../../components/ui";
import { ApiError } from "../../lib/api";
import { NeedsVenueSelectionError, useAuth } from "../../lib/auth-context";
import { useLocale } from "../../lib/locale-context";

export default function StaffLogin() {
  const { loginStaff, selectStaffVenue } = useAuth();
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [venuePicker, setVenuePicker] = useState<{ venues: VenueSummary[]; preAuthToken: string } | null>(null);

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginStaff(email.trim(), password);
      router.replace("/(staff)");
    } catch (e) {
      if (e instanceof NeedsVenueSelectionError) {
        setVenuePicker({ venues: e.venues, preAuthToken: e.preAuthToken });
      } else {
        setError(e instanceof ApiError ? e.message : t.common.genericError);
      }
    } finally {
      setLoading(false);
    }
  };

  const pickVenue = async (venueId: string) => {
    if (!venuePicker) return;
    setError(null);
    setLoading(true);
    try {
      await selectStaffVenue(venuePicker.preAuthToken, venueId);
      router.replace("/(staff)");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t.common.genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {venuePicker ? (
            <>
              <Heading>{t.mobile.staffLogin.chooseVenue}</Heading>
              <Text style={styles.hint}>{t.mobile.staffLogin.chooseVenueSubtitle}</Text>

              <View style={styles.form}>
                {venuePicker.venues.map((venue) => (
                  <Pressable
                    key={venue.id}
                    onPress={() => pickVenue(venue.id)}
                    disabled={loading}
                    style={({ pressed }) => [styles.venueRow, pressed && { opacity: 0.7 }]}
                  >
                    <Text style={styles.venueName}>{venue.name}</Text>
                    {venue.status !== "VERIFIED" && (
                      <Text style={styles.venueStatus}>{t.mobile.staffLogin.notVerified}</Text>
                    )}
                  </Pressable>
                ))}
              </View>

              {error && <Text style={styles.error}>{error}</Text>}

              <View style={styles.actions}>
                <GoldButton title={t.mobile.staffLogin.back} variant="outline" onPress={() => setVenuePicker(null)} />
              </View>
            </>
          ) : (
            <>
              <Heading>{t.mobile.staffLogin.heading}</Heading>
              <Text style={styles.hint}>{t.mobile.staffLogin.subtitle}</Text>

              <View style={styles.form}>
                <Input placeholder={t.mobile.staffLogin.email} value={email} onChangeText={setEmail} keyboardType="email-address" />
                <PasswordInput placeholder={t.mobile.staffLogin.password} value={password} onChangeText={setPassword} />
              </View>

              {error && <Text style={styles.error}>{error}</Text>}

              <View style={styles.actions}>
                <GoldButton title={t.mobile.staffLogin.submit} onPress={submit} loading={loading} />
              </View>
              <Pressable
                onPress={() => WebBrowser.openBrowserAsync("https://velvet-network.app/forgot-password?kind=staff")}
              >
                <Text style={styles.forgotText}>{t.mobile.staffLogin.forgotPassword}</Text>
              </Pressable>
            </>
          )}

          <View style={styles.langRow}>
            <LanguageSwitcher style={{ alignSelf: "center" }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 28, paddingTop: 80, gap: 6 },
  hint: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 14, marginBottom: 24 },
  form: { gap: 12 },
  error: { fontFamily: fonts.body, color: colors.danger, marginTop: 14 },
  actions: { marginTop: 28 },
  langRow: { marginTop: 32, alignItems: "center" },
  venueRow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  venueName: { fontFamily: fonts.body, color: colors.text, fontSize: 15 },
  venueStatus: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 12 },
  forgotText: { fontFamily: fonts.body, color: colors.textMuted, textAlign: "center", fontSize: 13, marginTop: 16 },
});
