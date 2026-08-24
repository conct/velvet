import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { colors } from "@velvet/shared";
import * as Linking from "expo-linking";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../lib/auth-context";
import { LocaleProvider } from "../lib/locale-context";
import { PENDING_INVITE_CODE_KEY } from "../lib/invite-storage";
import { setItem } from "../lib/storage";

SplashScreen.preventAutoHideAsync().catch(() => {});

// Captured synchronously at module load -- on web, React Navigation briefly
// resyncs the address bar back to "/" while it reconciles the auth-gated
// (guest) layout's own redirect, so reading window.location later (even
// from an effect in that layout) can already see the wrong path. Module
// load runs before any of that, so it's the only reliably-correct read.
const initialWebInviteCode =
  Platform.OS === "web" && typeof window !== "undefined"
    ? window.location.pathname.match(/\/invite\/([^/]+)\/?$/)?.[1]
    : undefined;

export default function RootLayout() {
  const [loaded] = useFonts({
    PlayfairDisplay_700Bold,
    PlayfairDisplay_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => {});
  }, [loaded]);

  useEffect(() => {
    async function captureInviteDeepLink() {
      let code: string | null = null;
      if (Platform.OS === "web") {
        code = initialWebInviteCode ? decodeURIComponent(initialWebInviteCode) : null;
      } else {
        const url = await Linking.getInitialURL();
        const match = url ? Linking.parse(url).path?.match(/(?:^|\/)invite\/([^/]+)\/?$/) : null;
        code = match ? decodeURIComponent(match[1]) : null;
      }
      if (code) await setItem(PENDING_INVITE_CODE_KEY, code);
    }
    captureInviteDeepLink().catch(() => {});
  }, []);

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <LocaleProvider>
        <AuthProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
        </AuthProvider>
      </LocaleProvider>
    </SafeAreaProvider>
  );
}
