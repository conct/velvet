-- AddColumn: Venue.status
ALTER TABLE "Venue" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "StaffVenueMembership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "staffAccountId" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StaffVenueMembership_staffAccountId_fkey" FOREIGN KEY ("staffAccountId") REFERENCES "StaffAccount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StaffVenueMembership_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffVenueMembership_staffAccountId_venueId_key" ON "StaffVenueMembership"("staffAccountId", "venueId");

-- Backfill: copy each existing StaffAccount's venueId/role into a membership row
INSERT INTO "StaffVenueMembership" ("id", "staffAccountId", "venueId", "role", "createdAt")
SELECT lower(hex(randomblob(16))), "id", "venueId", "role", CURRENT_TIMESTAMP FROM "StaffAccount";

-- Backfill: existing venues (created before verification existed) are already real, live venues
UPDATE "Venue" SET "status" = 'VERIFIED';

-- Drop StaffAccount.role/venueId. venueId is part of a FOREIGN KEY, which
-- SQLite can't drop with a plain ALTER TABLE DROP COLUMN -- rebuild the table.
CREATE TABLE "new_StaffAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_StaffAccount" ("id", "email", "passwordHash", "name", "createdAt")
SELECT "id", "email", "passwordHash", "name", "createdAt" FROM "StaffAccount";
DROP TABLE "StaffAccount";
ALTER TABLE "new_StaffAccount" RENAME TO "StaffAccount";
CREATE UNIQUE INDEX "StaffAccount_email_key" ON "StaffAccount"("email");
