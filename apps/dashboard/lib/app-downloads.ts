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
  /** Shown next to the title, e.g. the version of the hosted APK. */
  meta?: string;
}

// Apple has no ID-free deep link to an app listing, so the App Store tile
// stays hidden until the numeric App ID (App Store Connect → App Information
// → General Information → Apple ID) is filled in here.
const APPLE_APP_ID: string | null = null;

// Google derives the listing URL from the applicationId, which is
// `android.package` in apps/mobile/app.json -- nothing to look up.
const ANDROID_PACKAGE = "space.feif.velvet";
const ANDROID_LISTING_LIVE = false;

// Direct APK for people who don't have (or don't want) Play Store access.
// The file is deliberately not committed -- it is tens of megabytes and
// changes with every release. Build it with
// `eas build -p android --profile preview` and upload it next to the
// Werbematerial PDFs (see docs/deployment.md). Set this back to null whenever
// no current APK is uploaded, so the tile disappears instead of 404ing.
const APK_FILE: { path: string; version: string } | null = null;

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
  if (APK_FILE) {
    sources.push({ key: "apk", href: APK_FILE.path, isFile: true, meta: `v${APK_FILE.version}` });
  }
  // Always available, and the only option while the store listings are still
  // in review -- so the section is never empty.
  sources.push({ key: "web", href: WEB_APP_URL });

  return sources;
}
