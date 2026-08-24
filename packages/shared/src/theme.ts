export const colors = {
  background: "#0B0B0C",
  surface: "#161616",
  surfaceRaised: "#1E1B14",
  border: "#2A2620",
  gold: "#D4AF37",
  goldBright: "#F4E5A1",
  goldMuted: "#8A7530",
  text: "#F5F1E8",
  textMuted: "#A79F8E",
  danger: "#B23A3A",
  success: "#3FA772",
} as const;

export const tierColors: Record<string, string> = {
  VIP: colors.gold,
  TRUSTED: colors.success,
  STANDARD: colors.textMuted,
  WATCH: "#C7893A",
  BANNED: colors.danger,
};

export const tierLabels: Record<string, string> = {
  VIP: "VIP",
  TRUSTED: "Vertraut",
  STANDARD: "Standard",
  WATCH: "Beobachtung",
  BANNED: "Gesperrt",
};

export const fonts = {
  heading: "PlayfairDisplay_700Bold",
  headingRegular: "PlayfairDisplay_400Regular",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemiBold: "Inter_600SemiBold",
} as const;

export const radii = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
} as const;

export const spacing = (n: number) => n * 4;
