import { colors, fonts } from "@velvet/shared";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { GoldButton, LanguageSwitcher, Screen } from "../../components/ui";
import { useLocale } from "../../lib/locale-context";
import { TABLET_CONTENT_WIDTH, useIsTablet } from "../../lib/use-tablet";

export default function Welcome() {
  const { t } = useLocale();
  const isTablet = useIsTablet();
  const block = isTablet ? styles.blockTablet : undefined;
  return (
    <Screen>
      <View style={[styles.container, isTablet && styles.containerTablet]}>
        <View style={[styles.brand, block]}>
          <Text style={styles.title}>VELVET</Text>
          <View style={styles.rule} />
          <Text style={styles.subtitle}>{t.landing.tagline}</Text>
        </View>

        <View style={block}>
          <View style={styles.actions}>
            <Link href="/(auth)/guest-login" asChild>
              <GoldButton title={t.mobile.welcome.continueAsGuest} onPress={() => {}} />
            </Link>
            <Link href="/(auth)/staff-login" asChild>
              <GoldButton title={t.mobile.welcome.staffLogin} onPress={() => {}} variant="outline" />
            </Link>
          </View>
          <View style={styles.legalRow}>
            <Link href="/(auth)/impressum">
              <Text style={styles.legalLink}>{t.mobile.welcome.impressum}</Text>
            </Link>
            <Link href="/(auth)/datenschutz">
              <Text style={styles.legalLink}>{t.mobile.welcome.datenschutz}</Text>
            </Link>
            <Link href="/(auth)/agb">
              <Text style={styles.legalLink}>{t.mobile.welcome.agb}</Text>
            </Link>
            <Link href="/(auth)/widerruf">
              <Text style={styles.legalLink}>{t.mobile.welcome.widerruf}</Text>
            </Link>
          </View>
          <View style={styles.langRow}>
            <LanguageSwitcher style={{ alignSelf: "center" }} />
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between", padding: 28, paddingTop: 120, paddingBottom: 48 },
  // Auf Tablets trägt "space-between" nicht: zwischen Marke und Buttons klafft
  // sonst die halbe Bildschirmhöhe. Stattdessen mittig mit festem Abstand, und
  // beide Blöcke auf Lesebreite begrenzt.
  containerTablet: { justifyContent: "center", gap: 72, paddingTop: 28, paddingBottom: 28 },
  blockTablet: { width: "100%", maxWidth: TABLET_CONTENT_WIDTH, alignSelf: "center" },
  brand: { alignItems: "center" },
  title: { fontFamily: fonts.heading, color: colors.gold, fontSize: 44, letterSpacing: 6 },
  rule: { width: 60, height: 1, backgroundColor: colors.gold, marginTop: 18, marginBottom: 18 },
  subtitle: { fontFamily: fonts.headingRegular, color: colors.textMuted, fontSize: 16, fontStyle: "italic" },
  actions: { gap: 14 },
  legalRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 20, marginTop: 20 },
  langRow: { marginTop: 20, alignItems: "center" },
  legalLink: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 12 },
});
