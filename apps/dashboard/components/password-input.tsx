"use client";

import { useState, type InputHTMLAttributes } from "react";
import { useLocale } from "../lib/locale-context";

export function PasswordInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  const { t } = useLocale();

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`w-full rounded-lg border border-border bg-background px-4 py-2.5 pr-11 text-sm text-text placeholder-text-muted outline-none focus:border-gold ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? t.common.hidePassword : t.common.showPassword}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-text"
      >
        {visible ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M9.36 5.36A9.77 9.77 0 0112 5c5 0 9 4.5 10 7-.5 1.35-1.42 2.9-2.73 4.24M6.6 6.6C4.6 8 3.3 10 2 12c1 2.5 5 7 10 7 1.28 0 2.5-.29 3.6-.79"
            />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
            />
            <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
