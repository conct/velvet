import fs from "fs";
import { imageSize } from "image-size";
import sharp from "sharp";
import { t, type Locale } from "./i18n";

const MIN_DIMENSION = 400;
// 0-255 scale. Below this average luminance, a phone photo is almost always
// unusable for door-staff identification (a dark room, a face in shadow).
const MIN_MEAN_BRIGHTNESS = 25;
// Std deviation of luminance. A near-zero value means a flat/solid-color or
// heavily motion-blurred image -- not a real usable portrait.
const MIN_CONTRAST_STDDEV = 12;

export interface PhotoVerificationResult {
  ok: boolean;
  reason?: string;
}

// multer's fileFilter only checks the client-declared Content-Type, which an
// attacker fully controls -- it does not prove the bytes are actually a
// JPEG/PNG/WebP. `image-size`'s ICNS/JXL/HEIF parsers have an unpatched
// infinite-loop DoS (GHSA-w3rx-r6r6-pgpr, GHSA-5p2g-fcmc-qvqq), so a crafted
// upload with a spoofed image/jpeg header could hang the event loop the
// moment `imageSize()` tries to auto-detect its format. Sniffing the magic
// bytes for exactly the three formats this app supports, and refusing to
// call `imageSize` at all on anything else, keeps every other parser in the
// library from ever running on attacker-controlled input.
function looksLikeSupportedImage(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng = buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp = buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  return isJpeg || isPng || isWebp;
}

// Local, free quality gate: resolution plus a brightness/contrast heuristic.
// The brightness/contrast check previously ran via `sharp`, but sharp's
// prebuilt libvips binary needs glibc 2.28+ and the old production host
// (glibc 2.17) loaded it but segfaulted on first use -- same root cause as
// `apps/dashboard` once needing `next build --webpack` instead of the
// default Turbopack/SWC native binary. Both were host-specific problems,
// not code problems, and no longer apply after the move to a glibc 2.28+
// host. A vision-API check was tried before that too and dropped for its
// per-call cost.
export async function verifyProfilePhoto(filePath: string, locale: Locale): Promise<PhotoVerificationResult> {
  const buffer = fs.readFileSync(filePath);

  if (!looksLikeSupportedImage(buffer)) {
    return { ok: false, reason: t(locale, "users.invalidImageType") };
  }

  const dimensions = imageSize(buffer);
  if (!dimensions.width || !dimensions.height || dimensions.width < MIN_DIMENSION || dimensions.height < MIN_DIMENSION) {
    return { ok: false, reason: t(locale, "photo.tooSmall", { min: MIN_DIMENSION }) };
  }

  const { channels } = await sharp(buffer).greyscale().stats();
  const luminance = channels[0];
  if (luminance.mean < MIN_MEAN_BRIGHTNESS) {
    return { ok: false, reason: t(locale, "photo.tooDark") };
  }
  if (luminance.stdev < MIN_CONTRAST_STDDEV) {
    return { ok: false, reason: t(locale, "photo.lowContrast") };
  }

  return { ok: true };
}
