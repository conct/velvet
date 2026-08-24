import { colors } from "@velvet/shared";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../lib/auth-context";

export default function Index() {
  const { ready, kind } = useAuth();

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  }

  if (kind === "guest") return <Redirect href="/(guest)" />;
  if (kind === "staff") return <Redirect href="/(staff)" />;
  return <Redirect href="/(auth)/welcome" />;
}
