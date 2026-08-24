// Loaded here rather than only in the entrypoints: every one-off script in
// server/scripts/ reaches the database through this module, and without
// server/.env being read they fail with Prisma's "Environment variable not
// found: DATABASE_URL" instead of doing anything useful. Importing it twice
// (index.ts and relay-watcher.ts also do) is a no-op.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
