"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { canManageVenue, type StaffRole, type Translations, type VenueSummary } from "@velvet/shared";
import { apiFetch } from "../lib/api";
import { useAuth } from "../lib/auth-context";
import { useLocale } from "../lib/locale-context";
import { LanguageSwitcher } from "./language-switcher";

function roleLabel(t: Translations, role: StaffRole): string {
  if (role === "MANAGER") return t.pages.team.roleManager;
  if (role === "SERVICE") return t.pages.team.roleService;
  return t.pages.team.roleDoorman;
}

function navItems(t: Translations) {
  return [
    { href: "/overview", label: t.nav.overview, symbol: "◆" },
    { href: "/guests", label: t.nav.guests, symbol: "✦" },
    { href: "/pending", label: t.nav.pending, symbol: "★" },
    { href: "/team", label: t.nav.team, symbol: "◈", managerOnly: true },
    { href: "/messages", label: t.nav.messages, symbol: "✉", managerOnly: true },
    { href: "/settings", label: t.nav.settings, symbol: "⚙" },
    { href: "/venues/new", label: t.nav.addVenue, symbol: "＋" },
    { href: "/admin/venues", label: t.nav.reviewVenues, symbol: "⚑", platformAdminOnly: true },
    { href: "/admin/applications", label: t.nav.reviewApplications, symbol: "✎", platformAdminOnly: true },
  ];
}

export function Sidebar() {
  const pathname = usePathname();
  const { token, staff, switchVenue, logout } = useAuth();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [venues, setVenues] = useState<VenueSummary[]>([]);

  useEffect(() => {
    if (!token) return;
    apiFetch<VenueSummary[]>("/auth/staff/venues", { token }).then(setVenues).catch(() => {});
  }, [token, staff?.venue.id]);

  const nav = (
    <nav className="mt-10 flex flex-1 flex-col gap-1">
      {navItems(t)
        .filter(
          (item) =>
            (!item.managerOnly || (staff ? canManageVenue(staff.role) : false)) &&
            (!item.platformAdminOnly || staff?.isPlatformAdmin)
        )
        .map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                active ? "bg-surface-raised text-gold" : "text-text-muted hover:text-text"
              }`}
            >
              <span className="w-4 text-center">{item.symbol}</span>
              {item.label}
            </Link>
          );
        })}
    </nav>
  );

  const footer = (
    <div className="border-t border-border pt-4">
      <div className="text-sm text-text">{staff?.name}</div>
      <div className="text-xs text-text-muted">{staff ? roleLabel(t, staff.role) : ""}</div>
      <div className="mt-3 flex items-center gap-3">
        <button onClick={logout} className="text-xs text-gold hover:text-gold-bright">
          {t.nav.logout}
        </button>
        <span className="text-border">·</span>
        <LanguageSwitcher />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label={t.nav.openMenu}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text hover:bg-surface-raised"
        >
          <span className="text-xl">☰</span>
        </button>
        <div className="font-heading text-lg tracking-[0.2em] text-gold">VELVET</div>
        <div className="w-9" />
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar / drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-border bg-surface px-6 py-8 transition-transform duration-200 md:sticky md:top-0 md:h-screen md:w-64 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="font-heading text-2xl tracking-[0.2em] text-gold">VELVET</div>
          {venues.length > 1 ? (
            <select
              value={staff?.venue.id}
              onChange={(e) => switchVenue(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-text-muted outline-none focus:border-gold"
            >
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                  {v.status !== "VERIFIED" ? ` (${t.login.notVerified})` : ""}
                </option>
              ))}
            </select>
          ) : (
            <div className="mt-1 text-xs text-text-muted">{staff?.venue.name}</div>
          )}
        </div>

        {nav}
        {footer}
      </aside>
    </>
  );
}
