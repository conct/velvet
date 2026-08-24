import { colors, fonts } from "@velvet/shared";
import { Redirect, Tabs } from "expo-router";
import { Text } from "react-native";
import { useAuth } from "../../lib/auth-context";
import { useLocale } from "../../lib/locale-context";

function TabIcon({ symbol, focused }: { symbol: string; focused: boolean }) {
  return <Text style={{ fontSize: 18, color: focused ? colors.gold : colors.textMuted }}>{symbol}</Text>;
}

export default function StaffLayout() {
  const { ready, kind, staffProfile } = useAuth();
  const { t } = useLocale();

  if (!ready) return null;
  if (kind !== "staff") return <Redirect href="/(auth)/welcome" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontFamily: fonts.bodyMedium, fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.mobile.tabBar.scanner,
          tabBarIcon: ({ focused }) => <TabIcon symbol="▦" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="pending"
        options={{
          title: t.mobile.tabBar.rate,
          tabBarIcon: ({ focused }) => <TabIcon symbol="★" focused={focused} />,
        }}
      />
      <Tabs.Screen name="rate/[entryLogId]" options={{ href: null }} />
    </Tabs>
  );
}
