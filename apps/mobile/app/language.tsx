import { colors, fonts, LOCALES, LOCALE_FLAGS, LOCALE_LABELS } from "@velvet/shared";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Heading, Screen } from "../components/ui";
import { useLocale } from "../lib/locale-context";

export default function LanguageScreen() {
  const { locale, setLocale, t } = useLocale();

  const choose = (next: (typeof LOCALES)[number]) => {
    setLocale(next);
    router.back();
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← {t.mobile.invite.preview.back}</Text>
        </Pressable>
      </View>

      <View style={styles.container}>
        <Heading size={24}>{t.languagePage.title}</Heading>
        <Text style={styles.subtitle}>{t.languagePage.subtitle}</Text>

        <View style={{ marginTop: 24, gap: 10 }}>
          {LOCALES.map((l) => (
            <Pressable
              key={l}
              onPress={() => choose(l)}
              style={[styles.row, locale === l && styles.rowActive]}
            >
              <Text style={styles.flag}>{LOCALE_FLAGS[l]}</Text>
              <Text style={[styles.label, locale === l && styles.labelActive]}>{LOCALE_LABELS[l]}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 60 },
  back: { fontFamily: fonts.bodyMedium, color: colors.gold, fontSize: 14 },
  container: { padding: 24, paddingTop: 20 },
  subtitle: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 14, marginTop: 6 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowActive: { borderColor: colors.gold, backgroundColor: colors.surfaceRaised },
  flag: { fontSize: 18 },
  label: { fontFamily: fonts.body, color: colors.text, fontSize: 15 },
  labelActive: { fontFamily: fonts.bodyMedium, color: colors.gold },
});
