import { colors, fonts } from "@velvet/shared";
import { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Card, Heading, Input, Label, Screen } from "../../components/ui";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import { useLocale } from "../../lib/locale-context";
import { TABLET_CONTENT_WIDTH, useIsTablet } from "../../lib/use-tablet";

interface Relationship {
  venue: { id: string; name: string; address: string };
  visits: number;
  lastVisitAt: string | null;
  localFlag: "NONE" | "VIP" | "BANNED";
}

export default function GuestVenues() {
  const isTablet = useIsTablet();
  const { token } = useAuth();
  const { t } = useLocale();
  const FLAG_LABEL: Record<string, string> = { VIP: t.mobile.venues.flagVip, BANNED: t.mobile.venues.flagBanned, NONE: "" };
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [query, setQuery] = useState("");
  const [hidingId, setHidingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiFetch<Relationship[]>("/users/me/venues", { token }).then(setRelationships).catch(() => {});
  }, [token]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return relationships;
    return relationships.filter(
      (r) => r.venue.name.toLowerCase().includes(q) || r.venue.address.toLowerCase().includes(q)
    );
  }, [relationships, query]);

  // Hiding cannot be undone from the app (only support can restore it), so it
  // never happens on a single tap -- the dialog spells out both what goes away
  // and what deliberately stays.
  const confirmHide = (venue: { id: string; name: string }) => {
    Alert.alert(t.mobile.venues.hideConfirmTitle, t.mobile.venues.hideConfirmBody, [
      { text: t.mobile.venues.hideCancel, style: "cancel" },
      {
        text: t.mobile.venues.hideConfirmAction,
        style: "destructive",
        onPress: async () => {
          if (!token) return;
          setHidingId(venue.id);
          try {
            await apiFetch(`/users/me/venues/${venue.id}/hide`, { method: "POST", token });
            setRelationships((current) => current.filter((r) => r.venue.id !== venue.id));
          } catch {
            Alert.alert(t.mobile.venues.hideFailed);
          } finally {
            setHidingId(null);
          }
        },
      },
    ]);
  };

  return (
    <Screen>
      <View style={[styles.header, isTablet && styles.tabletWidth]}>
        <Label muted>{t.mobile.venues.alreadyVisited}</Label>
        <Heading size={24}>{t.mobile.venues.title}</Heading>
        {relationships.length > 3 && (
          <View style={styles.search}>
            <Input placeholder={t.mobile.venues.searchPlaceholder} value={query} onChangeText={setQuery} />
          </View>
        )}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(r) => r.venue.id}
        contentContainerStyle={[styles.list, isTablet && styles.tabletWidth]}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {relationships.length === 0 ? t.mobile.venues.emptyNoVisits : t.mobile.venues.emptyNoResults}
          </Text>
        }
        renderItem={({ item: r }) => (
          <Card style={styles.card}>
            <View style={styles.row}>
              <View style={styles.details}>
                <Text style={styles.venueName}>{r.venue.name}</Text>
                <Text style={styles.venueAddress}>{r.venue.address}</Text>
                <Text style={styles.visits}>
                  {r.visits} {r.visits === 1 ? t.mobile.venues.visitsSingular : t.mobile.venues.visitsPlural}
                  {r.localFlag !== "NONE" ? ` · ${FLAG_LABEL[r.localFlag]}` : ""}
                </Text>
              </View>
              <Pressable
                onPress={() => confirmHide(r.venue)}
                disabled={hidingId === r.venue.id}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={`${t.mobile.venues.hide} — ${r.venue.name}`}
                style={({ pressed }) => [styles.hideButton, pressed && styles.hideButtonPressed]}
              >
                <Text style={styles.hideLabel}>{t.mobile.venues.hide}</Text>
              </Pressable>
            </View>
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 12, gap: 12 },
  search: { marginTop: 4 },
  list: { paddingHorizontal: 24, paddingBottom: 40, gap: 12 },
  tabletWidth: { width: "100%", maxWidth: TABLET_CONTENT_WIDTH, alignSelf: "center" },
  card: { gap: 4 },
  row: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  details: { flex: 1, gap: 4 },
  venueName: { fontFamily: fonts.bodySemiBold, color: colors.text, fontSize: 16 },
  venueAddress: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 13 },
  visits: { fontFamily: fonts.bodyMedium, color: colors.gold, fontSize: 12, marginTop: 6 },
  hideButton: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 999, borderWidth: 1, borderColor: colors.border },
  hideButtonPressed: { backgroundColor: colors.surfaceRaised },
  hideLabel: { fontFamily: fonts.bodyMedium, color: colors.textMuted, fontSize: 12 },
  empty: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 14, textAlign: "center", marginTop: 24 },
});
