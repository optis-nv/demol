/*
  Warnings:

  - Added the required column `publishAt` to the `EventLog` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EventLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishAt" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "data" TEXT NOT NULL
);
INSERT INTO "new_EventLog" ("createdAt", "publishAt", "data", "id", "type") SELECT "createdAt", "createdAt", "data", "id", "type" FROM "EventLog";
DROP TABLE "EventLog";
ALTER TABLE "new_EventLog" RENAME TO "EventLog";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

update EventLog set publishAt = createdAt where publishAt is null;