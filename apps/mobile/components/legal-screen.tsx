import { colors, fonts, type LegalSection } from "@velvet/shared";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Heading, Screen } from "./ui";

export function LegalScreen({
  title,
  sections,
  notice,
}: {
  title: string;
  sections: LegalSection[];
  /** Shown above the text, e.g. to mark a draft that has not been reviewed yet. */
  notice?: string;
}) {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Zurück</Text>
        </Pressable>
        <Heading size={26}>{title}</Heading>
        {notice ? <Text style={styles.notice}>{notice}</Text> : null}
        <View style={styles.sections}>
          {sections.map((section) => (
            <View key={section.heading}>
              <Text style={styles.heading}>{section.heading}</Text>
              <View style={styles.paragraphs}>
                {section.paragraphs.map((p, i) => (
                  <Text key={i} style={styles.paragraph}>
                    {p}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 28, paddingTop: 24, paddingBottom: 60, gap: 24 },
  back: { fontFamily: fonts.bodyMedium, color: colors.gold, fontSize: 14, marginBottom: 8 },
  notice: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 6,
    padding: 12,
  },
  sections: { gap: 22, marginTop: 8 },
  heading: { fontFamily: fonts.heading, color: colors.gold, fontSize: 17 },
  paragraphs: { marginTop: 6, gap: 8 },
  paragraph: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 14, lineHeight: 21 },
});
