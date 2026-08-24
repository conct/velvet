import { colors, fonts, type IncomingInviteRequest } from "@velvet/shared";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Avatar, Screen } from "../../../components/ui";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import { useLocale } from "../../../lib/locale-context";

export default function InviteRequests() {
  const { token } = useAuth();
  const { t } = useLocale();
  const [requests, setRequests] = useState<IncomingInviteRequest[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    const res = await apiFetch<IncomingInviteRequest[]>("/invites/requests/incoming", { token });
    setRequests(res);
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const respond = async (requestId: string, action: "accept" | "decline") => {
    if (!token) return;
    setBusyId(requestId);
    try {
      await apiFetch(`/invites/requests/${action}`, { method: "POST", token, body: { requestId } });
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← {t.mobile.invite.preview.back}</Text>
        </Pressable>
        <Text style={styles.title}>{t.mobile.invite.requestsScreen.title}</Text>
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={requests}
        keyExtractor={(r) => r.id}
        ListEmptyComponent={<Text style={styles.emptyText}>{t.mobile.invite.requestsScreen.noRequests}</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Avatar uri={item.photoUrl} name={item.displayName} size={44} />
            <Text style={styles.name}>{item.displayName}</Text>
            <View style={styles.actions}>
              <Pressable
                style={[styles.actionButton, styles.declineButton]}
                onPress={() => respond(item.id, "decline")}
                disabled={busyId === item.id}
              >
                <Text style={styles.declineText}>{t.mobile.invite.requestsScreen.decline}</Text>
              </Pressable>
              <Pressable
                style={styles.actionButton}
                onPress={() => respond(item.id, "accept")}
                disabled={busyId === item.id}
              >
                <Text style={styles.acceptText}>{t.mobile.invite.requestsScreen.accept}</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 12 },
  back: { fontFamily: fonts.bodyMedium, color: colors.gold, fontSize: 14, marginBottom: 16 },
  title: { fontFamily: fonts.heading, color: colors.text, fontSize: 22 },
  list: { paddingHorizontal: 24, paddingBottom: 40, gap: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  name: { flex: 1, fontFamily: fonts.bodyMedium, color: colors.text, fontSize: 15 },
  actions: { flexDirection: "row", gap: 8 },
  actionButton: { backgroundColor: colors.gold, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  declineButton: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.border },
  acceptText: { fontFamily: fonts.bodySemiBold, color: colors.background, fontSize: 12 },
  declineText: { fontFamily: fonts.bodySemiBold, color: colors.textMuted, fontSize: 12 },
  emptyText: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 13, textAlign: "center", marginTop: 40 },
});
