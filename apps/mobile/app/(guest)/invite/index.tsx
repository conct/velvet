import { colors, fonts } from "@velvet/shared";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { GoldButton, Input, Label, Screen } from "../../../components/ui";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import { useLocale } from "../../../lib/locale-context";

const INVITE_BASE_URL = "https://web.velvet-network.app/invite";

function extractCode(input: string): string {
  const trimmed = input.trim();
  const parts = trimmed.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? trimmed;
}

export default function InviteShare() {
  const { token } = useAuth();
  const { t } = useLocale();
  const [code, setCode] = useState<string | null>(null);
  const [rotating, setRotating] = useState(false);
  const [manualCode, setManualCode] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    const res = await apiFetch<{ code: string }>("/invites/me", { token });
    setCode(res.code);
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const shareLink = async () => {
    if (!code) return;
    await Share.share({ message: `${INVITE_BASE_URL}/${code}` });
  };

  const rotate = () => {
    Alert.alert(t.mobile.invite.rotateConfirmTitle, t.mobile.invite.rotateConfirmBody, [
      { text: t.mobile.invite.cancel, style: "cancel" },
      {
        text: t.mobile.invite.rotateConfirmButton,
        style: "destructive",
        onPress: async () => {
          if (!token) return;
          setRotating(true);
          try {
            const res = await apiFetch<{ code: string }>("/invites/me/rotate", { method: "POST", token });
            setCode(res.code);
          } finally {
            setRotating(false);
          }
        },
      },
    ]);
  };

  const openCode = () => {
    const value = manualCode.trim();
    if (!value) return;
    setManualCode("");
    router.push(`/(guest)/invite/${encodeURIComponent(extractCode(value))}`);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← {t.mobile.invite.preview.back}</Text>
        </Pressable>

        <Text style={styles.title}>{t.mobile.invite.shareTitle}</Text>
        <Text style={styles.subtitle}>{t.mobile.invite.shareSubtitle}</Text>

        <View style={styles.qrFrame}>
          {code ? (
            <QRCode value={`${INVITE_BASE_URL}/${code}`} size={200} backgroundColor={colors.text} color={colors.background} />
          ) : null}
        </View>

        {code && (
          <>
            <Label muted>{t.mobile.invite.yourCode}</Label>
            <Text style={styles.code}>{code}</Text>
          </>
        )}

        <View style={{ marginTop: 24, width: "100%", gap: 12 }}>
          <GoldButton title={t.mobile.invite.share} onPress={shareLink} />
          <GoldButton
            title={rotating ? t.mobile.invite.rotating : t.mobile.invite.rotate}
            variant="outline"
            onPress={rotate}
            disabled={rotating}
          />
        </View>

        <View style={styles.divider} />

        <Label muted>{t.mobile.invite.enterCode}</Label>
        <View style={styles.enterRow}>
          <View style={{ flex: 1 }}>
            <Input
              placeholder={t.mobile.invite.enterCodePlaceholder}
              value={manualCode}
              onChangeText={setManualCode}
              autoCapitalize="characters"
            />
          </View>
          <Pressable style={styles.goButton} onPress={openCode} disabled={!manualCode.trim()}>
            <Text style={styles.goButtonText}>→</Text>
          </Pressable>
        </View>

        <Pressable style={{ marginTop: 28 }} onPress={() => router.push("/(guest)/invite/requests")}>
          <Text style={styles.requestsLink}>{t.mobile.invite.requests} →</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingTop: 60, paddingHorizontal: 24, paddingBottom: 60 },
  back: { alignSelf: "flex-start", fontFamily: fonts.bodyMedium, color: colors.gold, fontSize: 14, marginBottom: 16 },
  title: { fontFamily: fonts.heading, color: colors.gold, fontSize: 24, textAlign: "center" },
  subtitle: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 19,
  },
  qrFrame: {
    width: 232,
    height: 232,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.text,
    marginTop: 24,
  },
  code: { fontFamily: fonts.heading, color: colors.text, fontSize: 26, letterSpacing: 4, marginTop: 4 },
  divider: { width: "100%", height: 1, backgroundColor: colors.border, marginTop: 32, marginBottom: 24 },
  enterRow: { flexDirection: "row", gap: 10, width: "100%", alignItems: "center", marginTop: 10 },
  goButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  goButtonText: { fontFamily: fonts.bodySemiBold, color: colors.background, fontSize: 18 },
  requestsLink: { fontFamily: fonts.bodyMedium, color: colors.gold, fontSize: 14 },
});
