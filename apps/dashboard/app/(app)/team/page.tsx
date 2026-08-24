"use client";

import { useEffect, useState } from "react";
import { canManageVenue, STAFF_ROLES, type StaffRole } from "@velvet/shared";
import { Button, Card, Heading, Input } from "../../../components/ui";
import { PasswordInput } from "../../../components/password-input";
import { ApiError, apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import { useLocale } from "../../../lib/locale-context";

interface StaffMember {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
}

export default function TeamPage() {
  const { token, staff } = useAuth();
  const { t } = useLocale();
  const [members, setMembers] = useState<StaffMember[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<StaffRole>("DOORMAN");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const roleLabels: Record<StaffRole, string> = {
    DOORMAN: t.pages.team.roleDoorman,
    SERVICE: t.pages.team.roleService,
    MANAGER: t.pages.team.roleManager,
  };

  const load = () => {
    if (!token) return;
    apiFetch<StaffMember[]>("/venues/me/staff", { token }).then(setMembers).catch(() => {});
  };

  useEffect(load, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch("/venues/me/staff", { method: "POST", token, body: { name, email, password, role } });
      setName("");
      setEmail("");
      setPassword("");
      setRole("DOORMAN");
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.pages.team.createFailed);
    } finally {
      setSubmitting(false);
    }
  };

  if (staff && !canManageVenue(staff.role)) {
    return (
      <div>
        <Heading className="text-3xl">{t.pages.team.title}</Heading>
        <p className="mt-4 text-sm text-text-muted">{t.pages.team.managerOnly}</p>
      </div>
    );
  }

  return (
    <div>
      <Heading className="text-3xl">{t.pages.team.title}</Heading>
      <p className="mt-1 text-sm text-text-muted">
        {t.pages.team.subtitle.replace("{venue}", staff?.venue.name ?? "")}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-text-muted">
                <th className="px-6 py-4 font-medium">{t.pages.team.colName}</th>
                <th className="px-6 py-4 font-medium">{t.pages.team.colEmail}</th>
                <th className="px-6 py-4 font-medium">{t.pages.team.colRole}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((m) => (
                <tr key={m.id}>
                  <td className="px-6 py-4 text-text">{m.name}</td>
                  <td className="px-6 py-4 text-text-muted">{m.email}</td>
                  <td className="px-6 py-4 text-gold">{roleLabels[m.role]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <Heading as="h2" className="text-lg">{t.pages.team.newMember}</Heading>
          <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
            <Input placeholder={t.pages.team.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} required />
            <Input
              placeholder={t.pages.team.emailPlaceholder}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <PasswordInput
              placeholder={t.pages.team.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as StaffRole)}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text outline-none focus:border-gold"
            >
              {STAFF_ROLES.map((r) => (
                <option key={r} value={r}>
                  {roleLabels[r]}
                </option>
              ))}
            </select>
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" disabled={submitting}>
              {submitting ? t.pages.team.creating : t.pages.team.create}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
