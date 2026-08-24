"use client";

import { RATING_TAGS } from "@velvet/shared";
import { useCallback, useEffect, useState } from "react";
import { Avatar, Button, Card, Heading, Input } from "../../../components/ui";
import { ApiError, apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import { useLocale } from "../../../lib/locale-context";

interface PendingEntry {
  entryLogId: string;
  displayName: string;
  photoUrl: string | null;
  scannedAt: string;
}

type LocalFlag = "NONE" | "VIP" | "BANNED";

export default function PendingPage() {
  const { token } = useAuth();
  const { t, locale } = useLocale();
  const FLAG_OPTIONS: { key: LocalFlag; label: string }[] = [
    { key: "NONE", label: t.pages.pending.flagNone },
    { key: "VIP", label: t.pages.pending.flagVip },
    { key: "BANNED", label: t.pages.pending.flagBanned },
  ];
  const [entries, setEntries] = useState<PendingEntry[]>([]);
  const [selected, setSelected] = useState<PendingEntry | null>(null);
  const [stars, setStars] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [flag, setFlag] = useState<LocalFlag>("NONE");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    apiFetch<PendingEntry[]>("/ratings/pending", { token }).then(setEntries).catch(() => {});
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const select = (entry: PendingEntry) => {
    setSelected(entry);
    setStars(0);
    setTags([]);
    setNote("");
    setFlag("NONE");
    setError(null);
  };

  const toggleTag = (key: string) => {
    setTags((prev) => (prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]));
  };

  const submit = async () => {
    if (!token || !selected || stars === 0) {
      setError(t.pages.pending.missingStars);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch("/ratings", {
        method: "POST",
        token,
        body: {
          entryLogId: selected.entryLogId,
          stars,
          tags,
          note: note || undefined,
          setLocalFlag: flag === "NONE" ? undefined : flag,
        },
      });
      setSelected(null);
      load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t.pages.pending.saveFailed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Heading className="text-3xl">{t.pages.pending.title}</Heading>
      <p className="mt-1 text-sm text-text-muted">{t.pages.pending.subtitle}</p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Card className="p-0">
          {entries.length === 0 ? (
            <div className="p-6 text-sm text-text-muted">{t.pages.pending.nothingPending}</div>
          ) : (
            <ul className="divide-y divide-border">
              {entries.map((entry) => (
                <li key={entry.entryLogId}>
                  <button
                    onClick={() => select(entry)}
                    className={`flex w-full items-center justify-between px-6 py-4 text-left transition ${
                      selected?.entryLogId === entry.entryLogId ? "bg-surface-raised" : "hover:bg-surface-raised/60"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Avatar uri={entry.photoUrl} name={entry.displayName} size={32} />
                      <span className="text-sm text-text">{entry.displayName}</span>
                    </span>
                    <span className="text-xs text-text-muted">
                      {new Date(entry.scannedAt).toLocaleTimeString(locale === "de" ? "de-DE" : "en-US")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {selected && (
          <Card>
            <div className="flex items-center gap-4">
              <Avatar uri={selected.photoUrl} name={selected.displayName} size={56} />
              <Heading as="h2" className="text-xl">{selected.displayName}</Heading>
            </div>

            <div className="mt-6">
              <div className="mb-2 text-xs uppercase tracking-wider text-text-muted">{t.pages.pending.stars}</div>
              <div className="flex gap-2 text-3xl">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setStars(n)}
                    className={n <= stars ? "text-gold" : "text-border"}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 text-xs uppercase tracking-wider text-text-muted">{t.pages.pending.tags}</div>
              <div className="flex flex-wrap gap-2">
                {RATING_TAGS.map((tag) => {
                  const active = tags.includes(tag.key);
                  return (
                    <button
                      key={tag.key}
                      onClick={() => toggleTag(tag.key)}
                      className={`rounded-full border px-3 py-1.5 text-xs ${
                        active ? "border-gold text-gold bg-surface-raised" : "border-border text-text-muted"
                      }`}
                    >
                      {t.ratingTags[tag.key as keyof typeof t.ratingTags] ?? tag.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 text-xs uppercase tracking-wider text-text-muted">
                {t.pages.pending.noteLabel}
              </div>
              <Input placeholder={t.pages.pending.notePlaceholder} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>

            <div className="mt-6">
              <div className="mb-2 text-xs uppercase tracking-wider text-text-muted">{t.pages.pending.statusHere}</div>
              <div className="flex flex-col gap-2">
                {FLAG_OPTIONS.map((opt) => (
                  <label key={opt.key} className="flex items-center gap-2 text-sm text-text">
                    <input
                      type="radio"
                      name="flag"
                      checked={flag === opt.key}
                      onChange={() => setFlag(opt.key)}
                      className="accent-[#d4af37]"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {error && <p className="mt-4 text-sm text-danger">{error}</p>}

            <Button onClick={submit} disabled={submitting} className="mt-8">
              {submitting ? t.pages.pending.saving : t.pages.pending.save}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
