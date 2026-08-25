import { colors, fonts } from "@velvet/shared";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { GoldButton, Label, Screen } from "../../components/ui";
import { ApiError, apiFetch } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import { useLocale } from "../../lib/locale-context";
import { TABLET_CONTENT_WIDTH, useIsTablet } from "../../lib/use-tablet";

const CODE_TTL_SECONDS = 90;

export default function GuestQr() {
  const isTablet = useIsTablet();
  const { token: authToken } = useAuth();
  const { t } = useLocale();
  const [code, setCode] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(CODE_TTL_SECONDS);
  const [error, setError] = useState<string | null>(null);
  const [photoRequired, setPhotoRequired] = useState(false);
  const expiresAtRef = useRef<number>(0);

  const fetchCode = useCallback(async () => {
    if (!authToken) return;
    try {
      setError(null);
      const res = await apiFetch<{ code: string; expiresAt: number }>("/qr/token", {
        method: "POST",
        token: authToken,
      });
      setCode(res.code);
      expiresAtRef.current = res.expiresAt;
      setSecondsLeft(Math.max(0, Math.round((res.expiresAt - Date.now()) / 1000)));
    } catch (e) {
      if (e instanceof ApiError && e.code === "PHOTO_REQUIRED") {
        setPhotoRequired(true);
      } else {
        setError(t.mobile.qr.loadFailed);
      }
    }
  }, [authToken]);

  useEffect(() => {
    fetchCode();
  }, [fetchCode]);

  useEffect(() => {
    if (photoRequired) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.round((expiresAtRef.current - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) fetchCode();
    }, 1000);
    return () => clearInterval(interval);
  }, [fetchCode, photoRequired]);

  const progress = secondsLeft / CODE_TTL_SECONDS;

  if (photoRequired) {
    return (
      <Screen>
        <View style={[styles.container, isTablet && styles.containerTablet]}>
          <Label muted>{t.mobile.qr.showAtDoor}</Label>
          <Text style={styles.title}>{t.mobile.qr.photoMissingTitle}</Text>
          <Text style={styles.photoRequiredText}>{t.mobile.qr.photoMissingBody}</Text>
          <View style={{ marginTop: 28, width: "100%" }}>
            <GoldButton title={t.mobile.qr.addPhotoButton} onPress={() => router.replace("/(guest)")} />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={[styles.container, isTablet && styles.containerTablet]}>
        <Label muted>{t.mobile.qr.showAtDoor}</Label>
        <Text style={styles.title}>{t.mobile.qr.accessCodeTitle}</Text>

        <View style={styles.qrFrame}>
          {code ? (
            <QRCode value={code} size={220} backgroundColor={colors.text} color={colors.background} />
          ) : (
            <ActivityIndicator color={colors.gold} size="large" />
          )}
        </View>

        {code && (
          <>
            <Text style={styles.codeLabel}>{t.mobile.qr.manualFallback}</Text>
            <Text style={styles.code}>{code}</Text>
          </>
        )}

        <View style={styles.countdownTrack}>
          <View style={[styles.countdownFill, { width: `${Math.max(0, progress) * 100}%` }]} />
        </View>
        <Text style={styles.countdownText}>
          {error ?? t.mobile.qr.expiresIn.replace("{s}", String(secondsLeft))}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 90, paddingHorizontal: 24 },
  // Der Code gehoert auf Augenhoehe, nicht an den oberen Rand einer iPad-Flaeche.
  containerTablet: { justifyContent: "center", paddingTop: 24, maxWidth: TABLET_CONTENT_WIDTH, alignSelf: "center", width: "100%" },
  title: { fontFamily: fonts.heading, color: colors.gold, fontSize: 26, marginTop: 6, marginBottom: 40 },
  photoRequiredText: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  qrFrame: {
    width: 264,
    height: 264,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.text,
  },
  codeLabel: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 12, marginTop: 24 },
  code: { fontFamily: fonts.heading, color: colors.text, fontSize: 32, letterSpacing: 8, marginTop: 6 },
  countdownTrack: {
    width: 220,
    height: 3,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginTop: 28,
    overflow: "hidden",
  },
  countdownFill: { height: 3, backgroundColor: colors.gold },
  countdownText: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 13, marginTop: 12 },
});
