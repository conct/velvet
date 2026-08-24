import { colors, fonts } from "@velvet/shared";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Avatar, Card, Heading, Label, Screen } from "../../components/ui";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import { useLocale } from "../../lib/locale-context";

interface PendingEntry {
  entryLogId: string;
  displayName: string;
  photoUrl: string | null;
  scannedAt: string;
}

export default function StaffPending() {
  const { token } = useAuth();
  const { t } = useLocale();
  const [entries, setEntries] = useState<PendingEntry[]>([]);

  const load = useCallback(() => {
    if (!token) return;
    apiFetch<PendingEntry[]>("/ratings/pending", { token }).then(setEntries).catch(() => {});
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <Screen>
      <View style={styles.header}>
        <Label muted>{t.mobile.staffPending.recentEntries}</Label>
        <Heading size={24}>{t.mobile.staffPending.title}</Heading>
      </View>
      <FlatList
        data={entries}
        keyExtractor={(e) => e.entryLogId}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>{t.mobile.staffPending.empty}</Text>}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(staff)/rate/[entryLogId]",
                params: { entryLogId: item.entryLogId, displayName: item.displayName },
              })
            }
          >
            <Card style={styles.card}>
              <View style={styles.cardLeft}>
                <Avatar uri={item.photoUrl} name={item.displayName} size={36} />
                <Text style={styles.name}>{item.displayName}</Text>
              </View>
              <Text style={styles.time}>{new Date(item.scannedAt).toLocaleTimeString("de-DE")}</Text>
            </Card>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 12 },
  list: { paddingHorizontal: 24, paddingBottom: 40, gap: 12 },
  card: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  name: { fontFamily: fonts.bodySemiBold, color: colors.text, fontSize: 15 },
  time: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 13 },
  empty: { fontFamily: fonts.body, color: colors.textMuted, textAlign: "center", marginTop: 40 },
});
