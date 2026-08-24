"use client";

import { useEffect, useRef, useState } from "react";
import type { EligibleGuest, MessageThreadSummary, StaffMessageDTO } from "@velvet/shared";
import { Avatar, Card, Heading, TierBadge } from "../../../components/ui";
import { ApiError, apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import { useLocale } from "../../../lib/locale-context";

export default function MessagesPage() {
  const { t } = useLocale();
  const { token, staff } = useAuth();
  const [threads, setThreads] = useState<MessageThreadSummary[]>([]);
  const [eligible, setEligible] = useState<EligibleGuest[]>([]);
  const [selected, setSelected] = useState<{ userId: string; displayName: string; photoUrl: string | null } | null>(
    null
  );
  const [messages, setMessages] = useState<StaffMessageDTO[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadLists = () => {
    if (!token) return;
    apiFetch<MessageThreadSummary[]>("/messages/staff/threads", { token }).then(setThreads).catch(() => {});
    apiFetch<EligibleGuest[]>("/messages/staff/eligible-guests", { token }).then(setEligible).catch(() => {});
  };

  useEffect(loadLists, [token]);

  const openThread = async (guest: { userId: string; displayName: string; photoUrl: string | null }) => {
    if (!token) return;
    setSelected(guest);
    setError(null);
    try {
      const history = await apiFetch<StaffMessageDTO[]>(`/messages/staff/thread/${guest.userId}`, { token });
      setMessages(history);
      loadLists();
    } catch {
      setError(t.pages.messages.loadHistoryFailed);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const send = async () => {
    if (!token || !selected || !draft.trim() || sending) return;
    setSending(true);
    setError(null);
    try {
      await apiFetch(`/messages/staff/thread/${selected.userId}`, {
        method: "POST",
        token,
        body: { body: draft.trim() },
      });
      setDraft("");
      const history = await apiFetch<StaffMessageDTO[]>(`/messages/staff/thread/${selected.userId}`, { token });
      setMessages(history);
      loadLists();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t.pages.messages.sendFailed);
    } finally {
      setSending(false);
    }
  };

  const eligibleWithoutThread = eligible.filter((g) => !threads.some((thread) => thread.userId === g.userId));

  if (staff && staff.role !== "MANAGER") {
    return (
      <div>
        <Heading className="text-3xl">{t.pages.messages.title}</Heading>
        <p className="mt-4 text-sm text-text-muted">{t.pages.messages.managerOnly}</p>
      </div>
    );
  }

  return (
    <div>
      <Heading className="text-3xl">{t.pages.messages.title}</Heading>
      <p className="mt-1 text-sm text-text-muted">{t.pages.messages.subtitle}</p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="flex max-h-[560px] flex-col gap-6 overflow-y-auto p-4">
          <div>
            <p className="px-2 text-xs uppercase tracking-wider text-text-muted">{t.pages.messages.conversations}</p>
            <div className="mt-2 flex flex-col gap-1">
              {threads.map((thread) => (
                <button
                  key={thread.userId}
                  onClick={() => openThread(thread)}
                  className={`flex items-center gap-3 rounded-lg px-2 py-2 text-left transition ${
                    selected?.userId === thread.userId ? "bg-surface-raised" : "hover:bg-surface-raised"
                  }`}
                >
                  <Avatar uri={thread.photoUrl} name={thread.displayName} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-text">{thread.displayName}</div>
                    <div className="truncate text-xs text-text-muted">{thread.lastMessage}</div>
                  </div>
                  {thread.unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-gold px-1.5 text-[11px] font-semibold text-background">
                      {thread.unreadCount}
                    </span>
                  )}
                </button>
              ))}
              {threads.length === 0 && <p className="px-2 py-3 text-xs text-text-muted">{t.pages.messages.noConversations}</p>}
            </div>
          </div>

          <div>
            <p className="px-2 text-xs uppercase tracking-wider text-text-muted">{t.pages.messages.writeToGuests}</p>
            <div className="mt-2 flex flex-col gap-1">
              {eligibleWithoutThread.map((g) => (
                <button
                  key={g.userId}
                  onClick={() => openThread(g)}
                  className={`flex items-center gap-3 rounded-lg px-2 py-2 text-left transition ${
                    selected?.userId === g.userId ? "bg-surface-raised" : "hover:bg-surface-raised"
                  }`}
                >
                  <Avatar uri={g.photoUrl} name={g.displayName} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-text">{g.displayName}</div>
                    <div className="flex items-center gap-1.5">
                      <TierBadge tier={g.globalTier} size="sm" />
                      {g.isPremium && <span className="text-[10px] uppercase tracking-wide text-gold">{t.pages.messages.premiumBadge}</span>}
                    </div>
                  </div>
                </button>
              ))}
              {eligibleWithoutThread.length === 0 && (
                <p className="px-2 py-3 text-xs text-text-muted">{t.pages.messages.noMoreGuests}</p>
              )}
            </div>
          </div>
        </Card>

        <Card className="flex h-[560px] flex-col p-0">
          {selected ? (
            <>
              <div className="flex items-center gap-3 border-b border-border px-6 py-4">
                <Avatar uri={selected.photoUrl} name={selected.displayName} size={36} />
                <div className="font-heading text-lg text-text">{selected.displayName}</div>
              </div>

              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
                {messages.map((m) => {
                  const fromStaff = m.senderStaffAccountId !== null;
                  return (
                    <div key={m.id} className={`flex ${fromStaff ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                          fromStaff
                            ? "rounded-br-sm bg-gold text-background"
                            : "rounded-bl-sm border border-border bg-surface-raised text-text"
                        }`}
                      >
                        {m.body}
                      </div>
                    </div>
                  );
                })}
                {messages.length === 0 && (
                  <p className="text-center text-sm text-text-muted">{t.pages.messages.noMessages}</p>
                )}
              </div>

              {error && <p className="px-6 pb-2 text-sm text-danger">{error}</p>}

              <div className="flex gap-2 border-t border-border p-4">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder={t.pages.messages.messagePlaceholder}
                  className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-gold"
                />
                <button
                  onClick={send}
                  disabled={sending || !draft.trim()}
                  aria-label={t.pages.messages.sendAriaLabel}
                  style={{ width: 40, height: 40 }}
                  className="flex shrink-0 items-center justify-center rounded-full bg-gold text-background transition hover:bg-gold-bright disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" strokeLinecap="round" strokeLinejoin="round" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-text-muted">{t.pages.messages.selectConversation}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
