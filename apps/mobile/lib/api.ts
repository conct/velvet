import { Platform } from "react-native";
import { DEFAULT_LOCALE, type Locale } from "@velvet/shared";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";

// Kept in sync by LocaleProvider (lib/locale-context.tsx) so apiFetch can read
// it synchronously -- the actual persisted value lives in SecureStore/
// localStorage (see lib/storage.ts), which is only accessible asynchronously.
let currentLocale: Locale = DEFAULT_LOCALE;
export function setCurrentLocale(locale: Locale) {
  currentLocale = locale;
}

export class ApiError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": currentLocale,
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = typeof data?.error === "string" ? data.error : "Etwas ist schiefgelaufen";
    throw new ApiError(message, typeof data?.code === "string" ? data.code : undefined);
  }

  return data as T;
}

export async function uploadGuestPhoto(
  token: string,
  asset: { uri: string; mimeType?: string | null }
): Promise<{ photoUrl: string }> {
  const form = new FormData();
  const filename = asset.uri.split("/").pop() || "photo.jpg";
  const type = asset.mimeType || "image/jpeg";

  if (Platform.OS === "web") {
    const blob = await (await fetch(asset.uri)).blob();
    form.append("photo", blob, filename);
  } else {
    // React Native's FormData accepts this {uri,name,type} shape for file uploads.
    form.append("photo", { uri: asset.uri, name: filename, type } as unknown as Blob);
  }

  const res = await fetch(`${API_URL}/users/me/photo`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(typeof data?.error === "string" ? data.error : "Upload fehlgeschlagen");
  }
  return data as { photoUrl: string };
}
