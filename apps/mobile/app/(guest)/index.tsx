import { colors, fonts } from "@velvet/shared";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { Avatar, Card, Divider, GoldButton, Heading, Label, Screen, TierBadge } from "../../components/ui";
import { ApiError, uploadGuestPhoto } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import { useLocale } from "../../lib/locale-context";

export default function GuestHome() {
  const { token, guestProfile, refreshGuestProfile, deleteAccount, logout } = useAuth();
  const { t } = useLocale();
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDeleteAccount = () => {
    Alert.alert(
      t.mobile.home.deleteConfirmTitle,
      t.mobile.home.deleteConfirmBody,
      [
        { text: t.mobile.home.deleteConfirmCancel, style: "cancel" },
        {
          text: t.mobile.home.deleteAccount,
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteAccount();
            } catch {
              setDeleting(false);
              Alert.alert(t.mobile.home.deleteErrorTitle, t.mobile.home.deleteErrorBody);
            }
          },
        },
      ]
    );
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshGuestProfile();
    setRefreshing(false);
  }, [refreshGuestProfile]);

  const pickPhoto = async (source: "library" | "camera") => {
    if (!token) return;
    setPhotoError(null);

    const permission =
      source === "library"
        ? await ImagePicker.requestMediaLibraryPermissionsAsync()
        : await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setPhotoError(t.mobile.home.photoAccessDenied);
      return;
    }

    const result =
      source === "library"
        ? await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.8 })
        : await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });

    if (result.canceled || !result.assets[0]) return;

    setUploading(true);
    try {
      await uploadGuestPhoto(token, result.assets[0]);
      await refreshGuestProfile();
    } catch (e) {
      setPhotoError(e instanceof ApiError ? e.message : t.mobile.home.uploadFailed);
    } finally {
      setUploading(false);
    }
  };

  if (!guestProfile) return null;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold} />}
      >
        <Label muted>{t.mobile.home.welcomeBack}</Label>
        <Heading>{guestProfile.firstName}</Heading>

        <View style={styles.avatarRow}>
          <Avatar uri={guestProfile.photoUrl} name={guestProfile.firstName} size={72} />
          <View style={{ gap: 6 }}>
            <Pressable onPress={() => pickPhoto("library")} disabled={uploading}>
              <Text style={styles.photoLink}>{t.mobile.home.choosePhotoLibrary}</Text>
            </Pressable>
            <Pressable onPress={() => pickPhoto("camera")} disabled={uploading}>
              <Text style={styles.photoLink}>{t.mobile.home.takePhoto}</Text>
            </Pressable>
          </View>
        </View>
        {uploading && <Text style={styles.uploadingText}>{t.mobile.home.uploading}</Text>}
        {photoError && <Text style={styles.error}>{photoError}</Text>}

        <Card style={styles.tierCard}>
          <Label muted>{t.mobile.home.yourStatus}</Label>
          <View style={styles.badgeRow}>
            <TierBadge tier={guestProfile.globalTier} size="lg" />
          </View>
          <Text style={styles.score}>{t.mobile.home.scoreLabel} {guestProfile.globalScore.toFixed(2)} / 5.0</Text>
          <Divider />
          <Text style={styles.perkText}>{t.mobile.home.tierPerks[guestProfile.globalTier as keyof typeof t.mobile.home.tierPerks]}</Text>
        </Card>

        <View style={{ marginTop: 24 }}>
          <GoldButton title={t.mobile.home.qrEntryButton} onPress={() => router.push("/(guest)/qr")} />
        </View>

        <Pressable style={styles.premiumCard} onPress={() => router.push("/(guest)/premium")}>
          <Text style={styles.premiumTitle}>{t.mobile.home.premiumTitle}</Text>
          <Text style={styles.premiumText}>{t.mobile.home.premiumTeaser}</Text>
        </Pressable>

        <Pressable style={styles.inviteCard} onPress={() => router.push("/(guest)/invite")}>
          <Text style={styles.inviteTitle}>{t.mobile.invite.shareTitle}</Text>
          <Text style={styles.inviteText}>{t.mobile.invite.shareSubtitle}</Text>
        </Pressable>

        <View style={{ marginTop: 32 }}>
          <GoldButton title={t.mobile.home.logout} variant="outline" onPress={logout} />
        </View>

        <Pressable onPress={confirmDeleteAccount} disabled={deleting} style={{ marginTop: 20 }}>
          <Text style={styles.deleteLink}>{deleting ? t.mobile.home.deletingAccount : t.mobile.home.deleteAccount}</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, paddingBottom: 60 },
  avatarRow: { flexDirection: "row", alignItems: "center", gap: 16, marginTop: 20 },
  photoLink: { fontFamily: fonts.bodyMedium, color: colors.gold, fontSize: 13 },
  uploadingText: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 12, marginTop: 8 },
  error: { fontFamily: fonts.body, color: colors.danger, fontSize: 12, marginTop: 8 },
  deleteLink: { fontFamily: fonts.body, color: colors.danger, fontSize: 13, textAlign: "center" },
  tierCard: { marginTop: 24 },
  badgeRow: { marginTop: 10 },
  score: { fontFamily: fonts.bodyMedium, color: colors.textMuted, marginTop: 12, fontSize: 13 },
  perkText: { fontFamily: fonts.body, color: colors.text, lineHeight: 21, fontSize: 14 },
  premiumCard: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 16,
    padding: 16,
    backgroundColor: colors.surfaceRaised,
  },
  premiumTitle: { fontFamily: fonts.heading, color: colors.gold, fontSize: 16 },
  premiumText: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 13, lineHeight: 19, marginTop: 6 },
  inviteCard: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    backgroundColor: colors.surface,
  },
  inviteTitle: { fontFamily: fonts.heading, color: colors.text, fontSize: 16 },
  inviteText: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 13, lineHeight: 19, marginTop: 6 },
});
