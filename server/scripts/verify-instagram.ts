// One-off sanity check for the Instagram Graph API setup -- run this after
// adding INSTAGRAM_ACCESS_TOKEN/INSTAGRAM_BUSINESS_ACCOUNT_ID to server/.env,
// before ever attempting a real post. Doesn't post anything.
//
// Usage: npm run verify-instagram

import "dotenv/config";
import { verifyInstagramConnection } from "../src/lib/social/instagram";

verifyInstagramConnection()
  .then((r) => console.log(`Verbunden als @${r.username} (Account-ID ${r.id})`))
  .catch((e) => {
    console.error("Verbindung fehlgeschlagen:", e.message);
    process.exitCode = 1;
  });
