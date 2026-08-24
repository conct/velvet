import { colors, fonts, type InviteCodePreview } from "@velvet/shared";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Avatar, GoldButton, Screen } from "../../../components/ui";
import { ApiError, apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import { useLocale } from "../../../lib/locale-context";

type RequestState = "idle" | "sending" | "sent" | "accepted";

export default function InvitePreview() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { token } = useAuth();
  const { t } = useLocale();
  const [preview, setPreview] = useState<InviteCodePreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestState, setRequestState] = useState<RequestState>("idle");

  useEffect(() => {
    if (!token || !code) return;
    apiFetch<InviteCodePreview>(`/invites/${encodeURIComponent(code)}`, { token })
      .then((res) => {
        setPreview(res);
        setLoading(false);
      })
      .catch((e) => {
        setError(e instanceof ApiError ? e.message : t.mobile.invite.loadFailed);
        setLoading(false);
      });
  }, [token, code]);

  const sendRequest = async () => {
    if (!token || !code) return;
    setRequestState("sending");
    try {
      const res = await apiFetch<{ status: string }>(`/invites/${encodeURIComponent(code)}/request`, {
        method: "POST",
        token,
      });
      setRequestState(res.status === "ACCEPTED" ? "accepted" : "sent");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t.mobile.invite.loadFailed);
      setRequestState("idle");
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← {t.mobile.invite.preview.back}</Text>
        </Pressable>

        {loading ? (
          <ActivityIndicator color={colors.gold} style={{ marginTop: 60 }} />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : preview ? (
          <View style={styles.card}>
            <Avatar uri={preview.photoUrl} name={preview.displayName} size={72} />
            <Text style={styles.name}>{preview.displayName}</Text>

            {requestState === "accepted" ? (
              <Text style={styles.note}>{t.mobile.invite.preview.alreadyConnected}</Text>
            ) : requestState === "sent" ? (
              <Text style={styles.note}>{t.mobile.invite.preview.requestSent}</Text>
            ) : (
              <View style={{ marginTop: 24, width: "100%" }}>
                <GoldButton
                  title={requestState === "sending" ? t.mobile.invite.preview.sending : t.mobile.invite.preview.sendRequest}
                  onPress={sendRequest}
                  loading={requestState === "sending"}
                />
              </View>
            )}
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 60, paddingHorizontal: 24 },
  back: { alignSelf: "flex-start", fontFamily: fonts.bodyMedium, color: colors.gold, fontSize: 14, marginBottom: 16 },
  card: { alignItems: "center", marginTop: 40, width: "100%" },
  name: { fontFamily: fonts.heading, color: colors.text, fontSize: 22, marginTop: 14 },
  note: { fontFamily: fonts.body, color: colors.gold, fontSize: 14, marginTop: 24, textAlign: "center" },
  error: { fontFamily: fonts.body, color: colors.danger, fontSize: 14, marginTop: 60, textAlign: "center" },
});
