// Publishes a single Instagram feed post. Manual, human-approved step -- run
// this only after Daniel has explicitly approved a specific draft in chat.
// image-url must be a publicly reachable HTTPS URL (Meta fetches it
// server-side); VELVET's existing /uploads static route is one way to host
// it temporarily if the image isn't already public somewhere.
//
// Usage: npm run post-instagram -- "<image-url>" "<caption>"

import "dotenv/config";
import { postToInstagram } from "../src/lib/social/instagram";

async function main() {
  const [, , imageUrl, caption] = process.argv;
  if (!imageUrl || !caption) {
    console.error('Usage: npm run post-instagram -- "<image-url>" "<caption>"');
    process.exitCode = 1;
    return;
  }

  const { postId } = await postToInstagram(imageUrl, caption);
  console.log(`Veröffentlicht — Post-ID: ${postId}`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exitCode = 1;
});
