import { colors, fonts } from "@velvet/shared";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { GoldButton, Heading, Screen } from "../../../components/ui";
import { useLocale } from "../../../lib/locale-context";

export default function PremiumCancel() {
  const { t } = useLocale();
  return (
    <Screen>
      <View style={styles.container}>
        <Heading>{t.mobile.premiumCancel.title}</Heading>
        <Text style={styles.text}>{t.mobile.premiumCancel.body}</Text>
        <View style={{ marginTop: 32, alignSelf: "stretch" }}>
          <GoldButton title={t.mobile.premiumCancel.button} onPress={() => router.replace("/(guest)/premium")} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  text: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 12,
  },
});
