import { colors, fonts } from "@velvet/shared";
import { Redirect, Tabs } from "expo-router";
import { Text } from "react-native";
import { useAuth } from "../../lib/auth-context";
import { useLocale } from "../../lib/locale-context";

function TabIcon({ symbol, focused }: { symbol: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 18, color: focused ? colors.gold : colors.textMuted }}>{symbol}</Text>
  );
}

export default function GuestLayout() {
  const { ready, kind } = useAuth();
  const { t } = useLocale();

  if (!ready) return null;
  if (kind !== "guest") return <Redirect href="/(auth)/welcome" />;

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
        options={{ title: t.mobile.tabBar.profile, tabBarIcon: ({ focused }) => <TabIcon symbol="◆" focused={focused} /> }}
      />
      <Tabs.Screen
        name="qr"
        options={{ title: t.mobile.tabBar.entry, tabBarIcon: ({ focused }) => <TabIcon symbol="▦" focused={focused} /> }}
      />
      <Tabs.Screen
        name="venues"
        options={{ title: t.mobile.tabBar.locations, tabBarIcon: ({ focused }) => <TabIcon symbol="✦" focused={focused} /> }}
      />
      <Tabs.Screen
        name="messages/index"
        options={{ title: t.mobile.tabBar.messages, tabBarIcon: ({ focused }) => <TabIcon symbol="✉" focused={focused} /> }}
      />
      <Tabs.Screen name="messages/[userId]" options={{ href: null }} />
      <Tabs.Screen name="premium" options={{ href: null }} />
      <Tabs.Screen name="premium/success" options={{ href: null }} />
      <Tabs.Screen name="premium/cancel" options={{ href: null }} />
      <Tabs.Screen name="invite/index" options={{ href: null }} />
      <Tabs.Screen name="invite/[code]" options={{ href: null }} />
      <Tabs.Screen name="invite/requests" options={{ href: null }} />
    </Tabs>
  );
}
