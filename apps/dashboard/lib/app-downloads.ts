import { LEGAL_OPERATOR } from "@velvet/shared";

// Every place the VELVET guest app can be obtained from. Kept in one file so
// a new store listing (or a pulled one) is a single edit -- the landing page
// renders exactly the sources that are configured here and nothing else, so
// an unfinished listing never ships as a dead link.

export type DownloadSourceKey = "ios" | "android" | "apk" | "web";

export interface DownloadSource {
  key: DownloadSourceKey;
  href: string;
  /** Rendered as a direct file download rather than a link to another page. */
  isFile?: boolean;
  /** Opens the visitor's mail client instead of a new tab. */
  isMail?: boolean;
  /** Shown next to the title, e.g. the version of a hosted APK. */
  meta?: string;
}

// Apple has no ID-free deep link to an app listing, so this is the numeric
// App ID from App Store Connect (App Information → General → Apple ID).
// Setting it back to null hides the App Store tile.
const APPLE_APP_ID: string | null = "6803371691";

// Google derives the listing URL from the applicationId, which is
// `android.package` in apps/mobile/app.json -- nothing to look up.
const ANDROID_PACKAGE = "space.feif.velvet";
const ANDROID_LISTING_LIVE = true;

// The APK is handed out on request rather than hosted for download: a
// sideloaded build never auto-updates, so every copy in the wild is one that
// has to be chased down when the API moves on. Keeping it a conversation
// means we know who has one. See docs/deployment.md for building it.
const APK_ON_REQUEST = true;

export const WEB_APP_URL = "https://web.velvet-network.app";

export function availableDownloadSources(): DownloadSource[] {
  const sources: DownloadSource[] = [];

  if (APPLE_APP_ID) {
    sources.push({ key: "ios", href: `https://apps.apple.com/app/id${APPLE_APP_ID}` });
  }
  if (ANDROID_LISTING_LIVE) {
    sources.push({
      key: "android",
      href: `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`,
    });
  }
  if (APK_ON_REQUEST) {
    sources.push({
      key: "apk",
      href: `mailto:${LEGAL_OPERATOR.email}?subject=${encodeURIComponent("VELVET APK")}`,
      isMail: true,
    });
  }
  // Always available, and the fallback for anyone who can use neither store.
  sources.push({ key: "web", href: WEB_APP_URL });

  return sources;
}
