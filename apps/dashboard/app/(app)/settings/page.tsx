"use client";

import { useEffect, useState } from "react";
import { Button, Card, Heading, Input } from "../../../components/ui";
import { ApiError, apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import { useLocale } from "../../../lib/locale-context";

interface VenueDetail {
  id: string;
  name: string;
  address: string;
  logoUrl: string | null;
}

export default function SettingsPage() {
  const { token, staff } = useAuth();
  const { t } = useLocale();
  const [venue, setVenue] = useState<VenueDetail | null>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedNote, setSavedNote] = useState(false);

  useEffect(() => {
    if (!token) return;
    apiFetch<VenueDetail>("/venues/me", { token })
      .then((v) => {
        setVenue(v);
        setName(v.name);
        setAddress(v.address);
        setLogoUrl(v.logoUrl ?? "");
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : t.pages.settings.loadFailed);
      });
  }, [token]);

  const isManager = staff?.role === "MANAGER";

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError(null);
    setSavedNote(false);
    try {
      const updated = await apiFetch<VenueDetail>("/venues/me", {
        method: "PATCH",
        token,
        body: { name, address, logoUrl: logoUrl || null },
      });
      setVenue(updated);
      setEditing(false);
      setSavedNote(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.pages.settings.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    if (!venue) return;
    setName(venue.name);
    setAddress(venue.address);
    setLogoUrl(venue.logoUrl ?? "");
    setEditing(false);
    setError(null);
  };

  return (
    <div>
      <Heading className="text-3xl">{t.pages.settings.title}</Heading>
      <p className="mt-1 text-sm text-text-muted">{t.pages.settings.subtitle}</p>

      <Card className="mt-8 max-w-lg">
        {!venue ? (
          error ? (
            <p className="text-sm text-danger">{error}</p>
          ) : (
            <p className="text-sm text-text-muted">{t.common.loading}</p>
          )
        ) : editing ? (
          <form onSubmit={save} className="flex flex-col gap-4">
            <div>
              <div className="mb-1 text-xs uppercase tracking-wider text-text-muted">{t.pages.settings.name}</div>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <div className="mb-1 text-xs uppercase tracking-wider text-text-muted">{t.pages.settings.address}</div>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <div>
              <div className="mb-1 text-xs uppercase tracking-wider text-text-muted">{t.pages.settings.logoUrl}</div>
              <Input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://…"
                type="url"
              />
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? t.pages.settings.saving : t.pages.settings.save}
              </Button>
              <Button type="button" variant="outline" onClick={cancel}>
                {t.pages.settings.cancel}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-4 text-sm">
            <div>
              <div className="text-xs uppercase tracking-wider text-text-muted">{t.pages.settings.name}</div>
              <div className="mt-1 text-text">{venue.name}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-text-muted">{t.pages.settings.address}</div>
              <div className="mt-1 text-text">{venue.address}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-text-muted">{t.pages.settings.loggedInAs}</div>
              <div className="mt-1 text-text">
                {staff?.name} · {staff?.email}
              </div>
            </div>
            {savedNote && <p className="text-sm text-success">{t.pages.settings.saved}</p>}
            {isManager && (
              <Button onClick={() => setEditing(true)} className="mt-2 self-start">
                {t.pages.settings.edit}
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
