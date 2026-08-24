import { RATING_TAGS, colors, fonts } from "@velvet/shared";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GoldButton, Heading, Input, Label, Screen } from "../../../components/ui";
import { ApiError, apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import { useLocale } from "../../../lib/locale-context";

type LocalFlag = "NONE" | "VIP" | "BANNED";

export default function RateGuest() {
  const { entryLogId, displayName } = useLocalSearchParams<{ entryLogId: string; displayName: string }>();
  const { token } = useAuth();
  const { t } = useLocale();
  const FLAG_OPTIONS: { key: LocalFlag; label: string }[] = [
    { key: "NONE", label: t.mobile.staffRate.flagNone },
    { key: "VIP", label: t.mobile.staffRate.flagVip },
    { key: "BANNED", label: t.mobile.staffRate.flagBanned },
  ];
  const [stars, setStars] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [flag, setFlag] = useState<LocalFlag>("NONE");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTag = (key: string) => {
    setTags((prev) => (prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]));
  };

  const submit = async () => {
    if (!token || stars === 0) {
      setError(t.mobile.staffRate.missingStars);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch("/ratings", {
        method: "POST",
        token,
        body: { entryLogId, stars, tags, note: note || undefined, setLocalFlag: flag === "NONE" ? undefined : flag },
      });
      router.back();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t.mobile.staffRate.saveFailed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Label muted>{t.mobile.staffRate.rateGuest}</Label>
        <Heading size={24}>{displayName}</Heading>

        <View style={styles.section}>
          <Label muted>{t.mobile.staffRate.starsLabel}</Label>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => setStars(n)}>
                <Text style={[styles.star, n <= stars && styles.starActive]}>★</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Label muted>{t.mobile.staffRate.traitsLabel}</Label>
          <View style={styles.tagWrap}>
            {RATING_TAGS.map((tag) => {
              const active = tags.includes(tag.key);
              return (
                <Pressable key={tag.key} onPress={() => toggleTag(tag.key)} style={[styles.tag, active && styles.tagActive]}>
                  <Text style={[styles.tagText, active && styles.tagTextActive]}>
                    {t.ratingTags[tag.key as keyof typeof t.ratingTags] ?? tag.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Label muted>{t.mobile.staffRate.noteLabel}</Label>
          <Input placeholder={t.mobile.staffRate.notePlaceholder} value={note} onChangeText={setNote} multiline style={styles.noteInput} />
        </View>

        <View style={styles.section}>
          <Label muted>{t.mobile.staffRate.statusHereLabel}</Label>
          <View style={{ gap: 8, marginTop: 8 }}>
            {FLAG_OPTIONS.map((opt) => (
              <Pressable key={opt.key} onPress={() => setFlag(opt.key)} style={styles.radioRow}>
                <View style={[styles.radioDot, flag === opt.key && styles.radioDotActive]} />
                <Text style={styles.radioLabel}>{opt.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={{ marginTop: 28 }}>
          <GoldButton title={t.mobile.staffRate.save} onPress={submit} loading={submitting} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, paddingBottom: 60 },
  section: { marginTop: 24 },
  stars: { flexDirection: "row", gap: 10, marginTop: 8 },
  star: { fontSize: 34, color: colors.border },
  starActive: { color: colors.gold },
  tagWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  tag: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  tagActive: { borderColor: colors.gold, backgroundColor: colors.surfaceRaised },
  tagText: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 12 },
  tagTextActive: { color: colors.gold },
  noteInput: { marginTop: 8, minHeight: 70, textAlignVertical: "top" },
  radioRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  radioDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  radioDotActive: { borderColor: colors.gold, backgroundColor: colors.gold },
  radioLabel: { fontFamily: fonts.body, color: colors.text, fontSize: 14 },
  error: { fontFamily: fonts.body, color: colors.danger, marginTop: 20 },
});
