"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Heading, Input } from "../../../../components/ui";
import { ApiError, apiFetch } from "../../../../lib/api";
import { useAuth } from "../../../../lib/auth-context";
import { useLocale } from "../../../../lib/locale-context";

interface CreatedVenue {
  id: string;
  name: string;
  slug: string;
  status: "PENDING" | "VERIFIED";
}

export default function NewVenuePage() {
  const router = useRouter();
  const { token, switchVenue } = useAuth();
  const { t } = useLocale();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<CreatedVenue | null>(null);
  const [switching, setSwitching] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setError(null);
    try {
      const venue = await apiFetch<CreatedVenue>("/venues", { method: "POST", token, body: { name, address } });
      setCreated(venue);
      setName("");
      setAddress("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.pages.venuesNew.createFailed);
    } finally {
      setSubmitting(false);
    }
  };

  const goToVenue = async () => {
    if (!created) return;
    setSwitching(true);
    try {
      await switchVenue(created.id);
      router.replace("/overview");
    } catch {
      setError(t.pages.venuesNew.switchFailed);
      setSwitching(false);
    }
  };

  return (
    <div>
      <Heading className="text-3xl">{t.pages.venuesNew.title}</Heading>
      <p className="mt-1 text-sm text-text-muted">{t.pages.venuesNew.subtitle}</p>

      <div className="mt-8 max-w-md">
        {created ? (
          <Card>
            <Heading as="h2" className="text-lg text-gold">
              {t.pages.venuesNew.createdHeading.replace("{name}", created.name)}
            </Heading>
            <p className="mt-3 text-sm text-text-muted">{t.pages.venuesNew.createdBody}</p>
            <Button className="mt-5" onClick={goToVenue} disabled={switching}>
              {switching ? t.pages.venuesNew.switching : t.pages.venuesNew.switchTo}
            </Button>
          </Card>
        ) : (
          <Card>
            <form onSubmit={submit} className="flex flex-col gap-3">
              <Input placeholder={t.pages.venuesNew.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} required />
              <Input
                placeholder={t.pages.venuesNew.addressPlaceholder}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              {error && <p className="text-sm text-danger">{error}</p>}
              <Button type="submit" disabled={submitting} className="mt-2">
                {submitting ? t.pages.venuesNew.creating : t.pages.venuesNew.create}
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
