"use client";

import { tierColors } from "@velvet/shared";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { useLocale } from "../lib/locale-context";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-surface p-6 ${className}`}>{children}</div>
  );
}

export function Heading({
  children,
  className = "",
  as: Tag = "h1",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return <Tag className={`font-heading text-text tracking-wide ${className}`}>{children}</Tag>;
}

export function Button({
  variant = "solid",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "outline" }) {
  const base =
    "rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition disabled:opacity-50 disabled:cursor-not-allowed";
  const solid = "bg-gold text-background hover:bg-gold-bright";
  const outline = "border border-gold text-gold hover:bg-gold/10";
  return <button className={`${base} ${variant === "solid" ? solid : outline} ${className}`} {...props} />;
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-gold"
      {...props}
    />
  );
}

export function Avatar({ uri, name, size = 36 }: { uri?: string | null; name: string; size?: number }) {
  const dim = { width: size, height: size };
  if (uri) {
    // eslint-disable-next-line @next/next/no-img-element -- external/local upload URLs, not a static asset
    return <img src={uri} alt={name} className="rounded-full border border-gold object-cover" style={dim} />;
  }
  return (
    <div
      className="flex items-center justify-center rounded-full border border-gold bg-surface-raised font-heading text-gold"
      style={{ ...dim, fontSize: size * 0.4 }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export function TierBadge({ tier, size = "md" }: { tier: string; size?: "sm" | "md" | "lg" }) {
  const { t } = useLocale();
  const color = tierColors[tier] ?? "#a79f8e";
  const sizeClass = size === "lg" ? "text-base px-4 py-1.5" : size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1";
  return (
    <span
      className={`inline-block rounded-full border font-semibold uppercase tracking-wider ${sizeClass}`}
      style={{ borderColor: color, color }}
    >
      {t.tiers[tier as keyof typeof t.tiers] ?? tier}
    </span>
  );
}
