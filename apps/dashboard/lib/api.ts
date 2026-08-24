import { DEFAULT_LOCALE, isLocale, type Locale } from "@velvet/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
export const LOCALE_STORAGE_KEY = "velvet_locale";

export class ApiError extends Error {}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH";
  body?: unknown;
  token?: string | null;
}

function currentLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return isLocale(stored) ? stored : DEFAULT_LOCALE;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": currentLocale(),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = typeof data?.error === "string" ? data.error : "Etwas ist schiefgelaufen";
    throw new ApiError(message);
  }

  return data as T;
}

// Multipart variant of apiFetch for endpoints that take a file (the public
// venue-application form). Deliberately does not set Content-Type -- the
// browser has to add its own multipart boundary.
export async function apiUpload<T>(path: string, formData: FormData, token?: string | null): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Accept-Language": currentLocale(),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = typeof data?.error === "string" ? data.error : "Etwas ist schiefgelaufen";
    throw new ApiError(message);
  }

  return data as T;
}

// The uploaded business registration sits behind a platform-admin-only route,
// so it can't be linked to directly -- it has to be fetched with the auth
// header and handed to the browser as a blob URL.
export async function fetchProtectedFileUrl(path: string, token: string): Promise<string> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Accept-Language": currentLocale(), Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(typeof data?.error === "string" ? data.error : "Etwas ist schiefgelaufen");
  }
  return URL.createObjectURL(await res.blob());
}
