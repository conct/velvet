import { colors, fonts, tierColors } from "@velvet/shared";
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from "expo-camera";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path, Polyline } from "react-native-svg";
import { Avatar, Card, Divider, GoldButton, Input, Label, LocaleIndicator, Screen, TierBadge } from "../../components/ui";
import { ApiError, apiFetch } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import { useLocale } from "../../lib/locale-context";

interface VerifyResult {
  displayName: string;
  photoUrl: string | null;
  globalTier: string;
  globalScore: number;
  venue: { visits: number; lastVisitAt: string | null; localFlag: string; privateNote: string | null };
  entryLogId: string;
}

function LogoutIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth={1.8}>
      <Path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <Polyline points="16 17 21 12 16 7" fill="none" stroke={colors.textMuted} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path strokeLinecap="round" strokeLinejoin="round" d="M21 12H9" />
    </Svg>
  );
}

export default function StaffScanner() {
  const { token, staffProfile, logout } = useAuth();
  const { t } = useLocale();
  const [permission, requestPermission] = useCameraPermissions();
  const [locked, setLocked] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const verify = async (code: string) => {
    if (!token || loading || !code) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<VerifyResult>("/qr/verify", {
        method: "POST",
        token,
        body: { code },
      });
      setResult(res);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t.mobile.staffScanner.scanFailed);
    } finally {
      setLoading(false);
    }
  };

  const onBarcodeScanned = (scan: BarcodeScanningResult) => {
    if (locked) return;
    setLocked(true);
    verify(scan.data);
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setManualCode("");
    setLocked(false);
  };

  if (result) {
    const color = tierColors[result.globalTier] ?? colors.textMuted;
    return (
      <Screen>
        <View style={styles.resultContainer}>
          <Card style={[styles.resultCard, { borderColor: color }]}>
            <Avatar uri={result.photoUrl} name={result.displayName} size={108} />
            <Text style={[styles.resultName, { marginTop: 12 }]}>{result.displayName}</Text>
            <View style={{ marginTop: 8 }}>
              <TierBadge tier={result.globalTier} size="lg" />
            </View>
            <Divider />
            <Label muted>{t.mobile.staffScanner.atVenue} {staffProfile?.venue.name}</Label>
            <Text style={styles.detailLine}>{result.venue.visits} {t.mobile.staffScanner.visitsHere}</Text>
            {result.venue.localFlag !== "NONE" && (
              <Text style={[styles.detailLine, { color }]}>
                {result.venue.localFlag === "VIP" ? t.mobile.staffScanner.onVipList : t.mobile.staffScanner.bannedHere}
              </Text>
            )}
            {result.venue.privateNote && <Text style={styles.note}>{t.mobile.staffScanner.noteLabel}: {result.venue.privateNote}</Text>}
          </Card>

          <View style={{ gap: 12, marginTop: 28 }}>
            <GoldButton
              title={t.mobile.staffScanner.rateButton}
              onPress={() =>
                router.push({
                  pathname: "/(staff)/rate/[entryLogId]",
                  params: { entryLogId: result.entryLogId, displayName: result.displayName },
                })
              }
            />
            <GoldButton title={t.mobile.staffScanner.continueScanning} variant="outline" onPress={reset} />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Label muted>{t.mobile.staffScanner.entryScanner}</Label>
            {staffProfile?.venue.name && <Text style={styles.venueName}>{staffProfile.venue.name}</Text>}
          </View>
          <View style={styles.headerActions}>
            {/* Personal hat kein Profil, in das eine Einstellungszeile passen
                wuerde, und der Scanner-Screen ist von Kamera und manueller
                Eingabe ausgefuellt. Die Kopfzeile ist damit die einzige Stelle,
                an der die Sprache nach dem Login noch erreichbar ist -- so wie
                sie es im Dashboard ueber die Sidebar immer ist. */}
            <Pressable onPress={() => router.push("/language")} hitSlop={10} accessibilityLabel={t.languagePage.title}>
              <LocaleIndicator />
            </Pressable>
            <Pressable onPress={() => logout()} hitSlop={10} accessibilityLabel={t.mobile.staffScanner.logoutLabel} style={{ marginTop: 3 }}>
              <LogoutIcon />
            </Pressable>
          </View>
        </View>
        <Text style={styles.title}>{t.mobile.staffScanner.scanTitle}</Text>

        <View style={styles.cameraFrame}>
          {permission?.granted ? (
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={onBarcodeScanned}
            />
          ) : (
            <Pressable style={styles.permissionPrompt} onPress={requestPermission}>
              <Text style={styles.permissionText}>{t.mobile.staffScanner.allowCamera}</Text>
            </Pressable>
          )}
        </View>

        {error && <Text style={styles.error}>{error}</Text>}
        {loading && <Text style={styles.loadingText}>{t.mobile.staffScanner.checkingCode}</Text>}

        <View style={styles.manualEntry}>
          <Label muted>{t.mobile.staffScanner.manualFallback}</Label>
          <Input
            placeholder={t.mobile.staffScanner.codePlaceholder}
            value={manualCode}
            onChangeText={setManualCode}
            keyboardType="number-pad"
            maxLength={6}
          />
          <GoldButton title={t.mobile.staffScanner.checkButton} variant="outline" onPress={() => verify(manualCode)} disabled={loading} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 60, paddingHorizontal: 24 },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 14 },
  venueName: { fontFamily: fonts.bodySemiBold, color: colors.text, fontSize: 13, marginTop: 2 },
  title: { fontFamily: fonts.heading, color: colors.gold, fontSize: 24, marginTop: 4, marginBottom: 24 },
  cameraFrame: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gold,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  permissionPrompt: { flex: 1, alignItems: "center", justifyContent: "center" },
  permissionText: { fontFamily: fonts.bodyMedium, color: colors.gold },
  error: { fontFamily: fonts.body, color: colors.danger, marginTop: 16 },
  loadingText: { fontFamily: fonts.body, color: colors.textMuted, marginTop: 16 },
  manualEntry: { width: "100%", marginTop: 28, gap: 10 },
  resultContainer: { flex: 1, padding: 24, paddingTop: 80 },
  resultCard: { borderWidth: 1 },
  resultName: { fontFamily: fonts.heading, color: colors.text, fontSize: 22 },
  detailLine: { fontFamily: fonts.body, color: colors.text, fontSize: 14, marginTop: 6 },
  note: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 13, marginTop: 10, fontStyle: "italic" },
});
