// Sends a one-off branded email (e.g. a newsletter draft) to a single
// recipient, using the same dark VELVET template as password-reset/
// verification mails. Manual CLI step, not exposed via any HTTP endpoint --
// mirrors comp-premium.ts.
//
// Usage: npm run send-email -- someone@example.com "Subject line" "Body text.
//
// Blank lines separate paragraphs."

import "dotenv/config";
import { sendCustomEmail } from "../src/lib/mailer";

async function main() {
  const [, , to, subject, body] = process.argv;
  if (!to || !subject || !body) {
    console.error('Usage: npm run send-email -- <email> "<subject>" "<body>"');
    process.exitCode = 1;
    return;
  }

  await sendCustomEmail(to, subject, body);
  console.log(`Sent to ${to}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
