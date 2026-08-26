import { colors, fonts, LOCALE_FLAGS, LOCALE_LABELS, radii, tierColors } from "@velvet/shared";
import { router } from "expo-router";
import { useState, type ReactNode } from "react";
import { useLocale } from "../lib/locale-context";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  useWindowDimensions,
  View,
  type TextInputProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";

export function Screen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      {children}
    </SafeAreaView>
  );
}

export function Heading({ children, size = 28 }: { children: ReactNode; size?: number }) {
  return <Text style={[styles.heading, { fontSize: size }]}>{children}</Text>;
}

export function Label({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return <Text style={[styles.label, muted && { color: colors.textMuted }]}>{children}</Text>;
}

export function Card({ children, style }: { children: ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// Ab dieser Breite zeigen wir die Sprache ausgeschrieben statt als Flagge.
// 640 ist Tailwinds `sm` und damit derselbe Punkt, an dem der Website-Header
// umschaltet (apps/dashboard/components/language-switcher.tsx) -- App und
// Website sollen bei gleicher Fensterbreite gleich aussehen.
//
// Der Textfall ist nicht nur Kosmetik: Windows liefert in Segoe UI Emoji
// bewusst keine Laenderflaggen-Glyphen aus, Chrome und Edge zeigen dort statt
// der Flagge nichts Brauchbares. Auf einem Desktop -- und das ist praktisch
// jedes Fenster ueber 640 -- ist das Label die einzige verlaessliche Anzeige.
const LOCALE_LABEL_MIN_WIDTH = 640;

/**
 * Nur die Anzeige der aktiven Sprache, ohne eigenes Antippen. Getrennt vom
 * Schalter, damit eine Zeile, die selbst schon Pressable ist (etwa im Profil),
 * die Anzeige einbinden kann, ohne zwei Pressables ineinander zu schachteln.
 */
export function LocaleIndicator() {
  const { locale } = useLocale();
  const { width } = useWindowDimensions();
  const showLabel = width >= LOCALE_LABEL_MIN_WIDTH;

  return (
    <Text style={showLabel ? styles.langLabelText : styles.langFlagText}>
      {showLabel ? LOCALE_LABELS[locale] : LOCALE_FLAGS[locale]}
    </Text>
  );
}

export function LanguageSwitcher({ style }: { style?: object } = {}) {
  return (
    <Pressable onPress={() => router.push("/language")} style={[styles.langFlag, style]}>
      <LocaleIndicator />
    </Pressable>
  );
}

export function GoldButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "solid",
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "solid" | "outline";
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        variant === "outline" && styles.buttonOutline,
        (disabled || loading) && { opacity: 0.5 },
        pressed && { opacity: 0.85 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? colors.gold : colors.background} />
      ) : (
        <Text style={[styles.buttonText, variant === "outline" && styles.buttonTextOutline]}>{title}</Text>
      )}
    </Pressable>
  );
}

export function Input(props: TextInputProps) {
  return (
    <RNTextInput
      placeholderTextColor={colors.textMuted}
      style={styles.input}
      autoCapitalize="none"
      {...props}
    />
  );
}

export function PasswordInput(props: TextInputProps) {
  const [visible, setVisible] = useState(false);
  const { t } = useLocale();

  return (
    <View style={styles.passwordWrapper}>
      <RNTextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, styles.passwordInput]}
        autoCapitalize="none"
        secureTextEntry={!visible}
        {...props}
      />
      <Pressable
        onPress={() => setVisible((v) => !v)}
        hitSlop={10}
        style={styles.passwordToggle}
        accessibilityLabel={visible ? t.common.hidePassword : t.common.showPassword}
      >
        {visible ? (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth={1.8}>
            <Path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M9.36 5.36A9.77 9.77 0 0112 5c5 0 9 4.5 10 7-.5 1.35-1.42 2.9-2.73 4.24M6.6 6.6C4.6 8 3.3 10 2 12c1 2.5 5 7 10 7 1.28 0 2.5-.29 3.6-.79"
            />
          </Svg>
        ) : (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth={1.8}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
            <Circle cx={12} cy={12} r={3} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        )}
      </Pressable>
    </View>
  );
}

export function Checkbox({
  checked,
  onChange,
  children,
  accessibilityLabel,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  children: ReactNode;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
      style={styles.checkboxRow}
    >
      <View style={[styles.checkboxBox, checked && styles.checkboxBoxChecked]}>
        {checked && (
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={colors.background} strokeWidth={3}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
          </Svg>
        )}
      </View>
      <View style={{ flex: 1 }}>{children}</View>
    </Pressable>
  );
}

export function TierBadge({ tier, size = "md" }: { tier: string; size?: "sm" | "md" | "lg" }) {
  const { t } = useLocale();
  const color = tierColors[tier] ?? colors.textMuted;
  const fontSize = size === "lg" ? 20 : size === "sm" ? 11 : 14;
  const paddingV = size === "lg" ? 10 : size === "sm" ? 4 : 7;
  return (
    <View style={[styles.badge, { borderColor: color, paddingVertical: paddingV }]}>
      <Text style={[styles.badgeText, { color, fontSize }]}>{t.tiers[tier as keyof typeof t.tiers] ?? tier}</Text>
    </View>
  );
}

export function Divider() {
  return <View style={styles.divider} />;
}

export function Avatar({ uri, name, size = 64 }: { uri?: string | null; name: string; size?: number }) {
  const dimStyle = { width: size, height: size, borderRadius: size / 2 };
  if (uri) {
    return <Image source={{ uri }} style={[styles.avatar, dimStyle]} />;
  }
  return (
    <View style={[styles.avatar, styles.avatarPlaceholder, dimStyle]}>
      <Text style={[styles.avatarInitial, { fontSize: size * 0.4 }]}>{name.charAt(0).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxBoxChecked: { backgroundColor: colors.gold, borderColor: colors.gold },
  screen: { flex: 1, backgroundColor: colors.background },
  langFlag: {
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: "transparent",
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  langFlagText: { fontSize: 16 },
  langLabelText: { fontFamily: fonts.bodyMedium, color: colors.gold, fontSize: 14, letterSpacing: 0.3 },
  heading: { fontFamily: fonts.heading, color: colors.text, letterSpacing: 0.3 },
  label: { fontFamily: fonts.body, color: colors.text, fontSize: 15 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  button: {
    backgroundColor: colors.gold,
    borderRadius: radii.pill,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.gold,
  },
  buttonText: {
    fontFamily: fonts.bodySemiBold,
    color: colors.background,
    fontSize: 16,
    letterSpacing: 0.4,
  },
  buttonTextOutline: { color: colors.gold },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 13,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 15,
    backgroundColor: colors.surface,
  },
  passwordWrapper: { position: "relative", justifyContent: "center" },
  passwordInput: { paddingRight: 46 },
  passwordToggle: { position: "absolute", right: 14, padding: 4 },
  badge: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
  },
  badgeText: { fontFamily: fonts.bodySemiBold, letterSpacing: 0.6, textTransform: "uppercase" },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  avatar: { borderWidth: 1, borderColor: colors.gold },
  avatarPlaceholder: { backgroundColor: colors.surfaceRaised, alignItems: "center", justifyContent: "center" },
  avatarInitial: { fontFamily: fonts.heading, color: colors.gold },
});
