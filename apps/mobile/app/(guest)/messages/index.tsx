import { colors, fonts, type EligibleMatch, type MessageThreadSummary } from "@velvet/shared";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Avatar, Heading, Label, Screen } from "../../../components/ui";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import { useLocale } from "../../../lib/locale-context";

export default function MessagesHome() {
  const { token } = useAuth();
  const { t } = useLocale();
  const [threads, setThreads] = useState<MessageThreadSummary[]>([]);
  const [matches, setMatches] = useState<EligibleMatch[]>([]);
  const [isPremium, setIsPremium] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    const [threadsResult, eligibleResult] = await Promise.all([
      apiFetch<MessageThreadSummary[]>("/messages/threads", { token }),
      apiFetch<{ isPremium: boolean; matches: EligibleMatch[] }>("/messages/eligible", { token }),
    ]);
    setThreads(threadsResult);
    setIsPremium(eligibleResult.isPremium);
    setMatches(eligibleResult.matches);
    setLoaded(true);
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (!loaded) return null;

  if (!isPremium && threads.length === 0) {
    return (
      <Screen>
        <View style={styles.upsell}>
          <Heading>{t.mobile.messagesHome.title}</Heading>
          <Text style={styles.upsellText}>{t.mobile.messagesHome.premiumUpsellBody}</Text>
          <Pressable style={styles.upsellButton} onPress={() => router.push("/(guest)/premium")}>
            <Text style={styles.upsellButtonText}>{t.mobile.messagesHome.discoverPremium}</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Heading>{t.mobile.messagesHome.title}</Heading>
      </View>
      <FlatList
        contentContainerStyle={styles.list}
        data={threads}
        keyExtractor={(thread) => thread.userId}
        ListHeaderComponent={
          matches.length > 0 ? (
            <View style={styles.matchesSection}>
              <Label muted>{t.mobile.messagesHome.whoWasThereTonight}</Label>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={matches}
                keyExtractor={(m) => m.userId}
                contentContainerStyle={{ gap: 14, paddingTop: 12 }}
                renderItem={({ item }) => (
                  <Pressable style={styles.matchCard} onPress={() => router.push(`/(guest)/messages/${item.userId}`)}>
                    <Avatar uri={item.photoUrl} name={item.displayName} size={56} />
                    <Text style={styles.matchName}>{item.displayName}</Text>
                    <Text style={styles.matchVenue}>{item.venueName}</Text>
                  </Pressable>
                )}
              />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable style={styles.threadRow} onPress={() => router.push(`/(guest)/messages/${item.userId}`)}>
            <Avatar uri={item.photoUrl} name={item.displayName} size={44} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.threadName}>{item.displayName}</Text>
              <Text style={styles.threadPreview} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
            {item.unreadCount > 0 && (
              <View style={styles.unreadDot}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </Pressable>
        )}
        ListEmptyComponent={
          matches.length === 0 ? <Text style={styles.emptyText}>{t.mobile.messagesHome.noMatches}</Text> : null
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 12 },
  list: { paddingHorizontal: 24, paddingBottom: 40, gap: 4 },
  upsell: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  upsellText: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 12,
  },
  upsellButton: {
    marginTop: 24,
    backgroundColor: colors.gold,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  upsellButtonText: { fontFamily: fonts.bodySemiBold, color: colors.background, fontSize: 15 },
  matchesSection: { marginBottom: 24 },
  matchCard: { alignItems: "center", width: 84 },
  matchName: { fontFamily: fonts.bodyMedium, color: colors.text, fontSize: 12, marginTop: 6, textAlign: "center" },
  matchVenue: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 11, textAlign: "center" },
  threadRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  threadName: { fontFamily: fonts.bodySemiBold, color: colors.text, fontSize: 15 },
  threadPreview: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 13, marginTop: 2 },
  unreadDot: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  unreadText: { fontFamily: fonts.bodySemiBold, color: colors.background, fontSize: 11 },
  emptyText: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 13, textAlign: "center", marginTop: 40 },
});
