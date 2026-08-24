import { colors, fonts, type MessageDTO } from "@velvet/shared";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "../../../components/ui";
import { ApiError, apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import { useLocale } from "../../../lib/locale-context";

const POLL_INTERVAL_MS = 4000;

export default function MessageThread() {
  const { userId: counterpartId } = useLocalSearchParams<{ userId: string }>();
  const { token, guestProfile } = useAuth();
  const { t } = useLocale();
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    if (!token || !counterpartId) return;
    try {
      const result = await apiFetch<MessageDTO[]>(`/messages/thread/${counterpartId}`, { token });
      setMessages(result);
    } catch {
      // keep last known messages on a transient poll failure
    }
  }, [token, counterpartId]);

  useFocusEffect(
    useCallback(() => {
      load();
      intervalRef.current = setInterval(load, POLL_INTERVAL_MS);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [load])
  );

  const send = async () => {
    const body = draft.trim();
    if (!token || !counterpartId || !body) return;
    setSending(true);
    setError(null);
    try {
      setDraft("");
      await apiFetch(`/messages/thread/${counterpartId}`, { method: "POST", token, body: { body } });
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t.mobile.messageThread.sendFailed);
    } finally {
      setSending(false);
    }
  };

  const blockUser = () => {
    Alert.alert(t.mobile.messageThread.blockConfirmTitle, t.mobile.messageThread.blockConfirmBody, [
      { text: t.mobile.messageThread.cancel, style: "cancel" },
      {
        text: t.mobile.messageThread.block,
        style: "destructive",
        onPress: async () => {
          if (!token || !counterpartId) return;
          await apiFetch(`/messages/thread/${counterpartId}/block`, { method: "POST", token });
          router.back();
        },
      },
    ]);
  };

  const reportLastMessage = () => {
    const last = [...messages].reverse().find((m) => m.senderId === counterpartId);
    if (!last) return;
    Alert.alert(t.mobile.messageThread.reportConfirmTitle, t.mobile.messageThread.reportConfirmBody, [
      { text: t.mobile.messageThread.cancel, style: "cancel" },
      {
        text: t.mobile.messageThread.report,
        onPress: async () => {
          if (!token) return;
          await apiFetch(`/messages/${last.id}/report`, {
            method: "POST",
            token,
            body: { reason: t.mobile.messageThread.reportReason },
          });
          Alert.alert(t.mobile.messageThread.reportThanksTitle, t.mobile.messageThread.reportThanksBody);
        },
      },
    ]);
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.back}>← {t.mobile.messageThread.back}</Text>
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable onPress={reportLastMessage}>
              <Text style={styles.headerAction}>{t.mobile.messageThread.report}</Text>
            </Pressable>
            <Pressable onPress={blockUser}>
              <Text style={[styles.headerAction, { color: colors.danger }]}>{t.mobile.messageThread.block}</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.messages}>
          {messages.map((m) => {
            const mine = m.senderId === guestProfile?.id;
            return (
              <View key={m.id} style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                <Text style={[styles.bubbleText, mine && styles.bubbleTextMine]}>{m.body}</Text>
              </View>
            );
          })}
          {messages.length === 0 && <Text style={styles.emptyText}>{t.mobile.messageThread.noMessages}</Text>}
        </ScrollView>

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.composer}>
          <TextInput
            style={styles.input}
            placeholder={t.mobile.messageThread.messagePlaceholder}
            placeholderTextColor={colors.textMuted}
            value={draft}
            onChangeText={setDraft}
            multiline
          />
          <Pressable style={styles.sendButton} onPress={send} disabled={sending || !draft.trim()}>
            <Text style={styles.sendButtonText}>{sending ? "…" : t.mobile.messageThread.send}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 12,
  },
  back: { fontFamily: fonts.bodyMedium, color: colors.gold, fontSize: 14 },
  headerActions: { flexDirection: "row", gap: 16 },
  headerAction: { fontFamily: fonts.bodyMedium, color: colors.textMuted, fontSize: 13 },
  messages: { padding: 24, gap: 10, flexGrow: 1 },
  bubble: { maxWidth: "80%", borderRadius: 16, paddingVertical: 10, paddingHorizontal: 14 },
  bubbleMine: { alignSelf: "flex-end", backgroundColor: colors.gold },
  bubbleTheirs: { alignSelf: "flex-start", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  bubbleText: { fontFamily: fonts.body, color: colors.text, fontSize: 14, lineHeight: 20 },
  bubbleTextMine: { color: colors.background },
  emptyText: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 13, textAlign: "center", marginTop: 40 },
  error: { fontFamily: fonts.body, color: colors.danger, fontSize: 12, paddingHorizontal: 24, marginBottom: 4 },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: { backgroundColor: colors.gold, borderRadius: 18, paddingHorizontal: 18, paddingVertical: 12 },
  sendButtonText: { fontFamily: fonts.bodySemiBold, color: colors.background, fontSize: 13 },
});
