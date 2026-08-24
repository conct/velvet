import { colors, fonts } from "@velvet/shared";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { GoldButton, Heading, Input, Label, LanguageSwitcher, PasswordInput, Screen } from "../../components/ui";
import { ApiError } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import { useLocale } from "../../lib/locale-context";

export default function GuestLogin() {
  const { loginGuest, registerGuest, resendVerification } = useAuth();
  const { t } = useLocale();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const submit = async () => {
    setError(null);
    setInfo(null);
    setNeedsVerification(false);
    setLoading(true);
    try {
      if (mode === "login") {
        await loginGuest(email.trim(), password);
        router.replace("/(guest)");
      } else {
        await registerGuest({ email: email.trim(), password, firstName, lastName });
        setInfo(t.mobile.guestLogin.registerSuccess);
        setMode("login");
      }
    } catch (e) {
      if (e instanceof ApiError && e.code === "EMAIL_NOT_VERIFIED") {
        setError(e.message);
        setNeedsVerification(true);
      } else {
        setError(e instanceof ApiError ? e.message : t.common.genericError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerification(email.trim());
      setError(null);
      setNeedsVerification(false);
      setInfo(t.mobile.guestLogin.verificationResent);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t.common.genericError);
    } finally {
      setResending(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Heading>{mode === "login" ? t.mobile.guestLogin.welcomeBack : t.mobile.guestLogin.createAccount}</Heading>
          <Text style={styles.hint}>
            {mode === "login" ? t.mobile.guestLogin.loginHint : t.mobile.guestLogin.registerHint}
          </Text>

          <View style={styles.form}>
            {mode === "register" && (
              <>
                <Input placeholder={t.mobile.guestLogin.firstName} value={firstName} onChangeText={setFirstName} />
                <Input placeholder={t.mobile.guestLogin.lastName} value={lastName} onChangeText={setLastName} />
              </>
            )}
            <Input placeholder={t.mobile.guestLogin.email} value={email} onChangeText={setEmail} keyboardType="email-address" />
            <PasswordInput placeholder={t.mobile.guestLogin.password} value={password} onChangeText={setPassword} />
          </View>

          {info && <Text style={styles.info}>{info}</Text>}
          {error && <Text style={styles.error}>{error}</Text>}
          {needsVerification && (
            <Pressable onPress={handleResend} disabled={resending}>
              <Text style={styles.forgotText}>
                {resending ? t.mobile.guestLogin.resending : t.mobile.guestLogin.resendVerification}
              </Text>
            </Pressable>
          )}

          <View style={styles.actions}>
            <GoldButton
              title={mode === "login" ? t.mobile.guestLogin.submitLogin : t.mobile.guestLogin.submitRegister}
              onPress={submit}
              loading={loading}
            />
            <Pressable onPress={() => setMode(mode === "login" ? "register" : "login")}>
              <Text style={styles.switchText}>
                {mode === "login" ? t.mobile.guestLogin.switchToRegister : t.mobile.guestLogin.switchToLogin}
              </Text>
            </Pressable>
            {mode === "login" && (
              <Pressable onPress={() => WebBrowser.openBrowserAsync("https://velvet-network.app/forgot-password?kind=user")}>
                <Text style={styles.forgotText}>{t.mobile.guestLogin.forgotPassword}</Text>
              </Pressable>
            )}
          </View>

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
  info: { fontFamily: fonts.body, color: colors.gold, marginTop: 14 },
  actions: { marginTop: 28, gap: 16 },
  langRow: { marginTop: 32, alignItems: "center" },
  switchText: { fontFamily: fonts.body, color: colors.gold, textAlign: "center", fontSize: 14 },
  forgotText: { fontFamily: fonts.body, color: colors.textMuted, textAlign: "center", fontSize: 13, marginTop: 12 },
});
