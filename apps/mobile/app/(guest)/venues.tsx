import { colors, fonts } from "@velvet/shared";
import { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Card, Heading, Input, Label, Screen } from "../../components/ui";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import { useLocale } from "../../lib/locale-context";

interface Relationship {
  venue: { id: string; name: string; address: string };
  visits: number;
  lastVisitAt: string | null;
  localFlag: "NONE" | "VIP" | "BANNED";
}

export default function GuestVenues() {
  const { token } = useAuth();
  const { t } = useLocale();
  const FLAG_LABEL: Record<string, string> = { VIP: t.mobile.venues.flagVip, BANNED: t.mobile.venues.flagBanned, NONE: "" };
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [query, setQuery] = useState("");

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

  return (
    <Screen>
      <View style={styles.header}>
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
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {relationships.length === 0 ? t.mobile.venues.emptyNoVisits : t.mobile.venues.emptyNoResults}
          </Text>
        }
        renderItem={({ item: r }) => (
          <Card style={styles.card}>
            <Text style={styles.venueName}>{r.venue.name}</Text>
            <Text style={styles.venueAddress}>{r.venue.address}</Text>
            <Text style={styles.visits}>
              {r.visits} {r.visits === 1 ? t.mobile.venues.visitsSingular : t.mobile.venues.visitsPlural}
              {r.localFlag !== "NONE" ? ` · ${FLAG_LABEL[r.localFlag]}` : ""}
            </Text>
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
  card: { gap: 4 },
  venueName: { fontFamily: fonts.bodySemiBold, color: colors.text, fontSize: 16 },
  venueAddress: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 13 },
  visits: { fontFamily: fonts.bodyMedium, color: colors.gold, fontSize: 12, marginTop: 6 },
  empty: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 14, textAlign: "center", marginTop: 24 },
});
