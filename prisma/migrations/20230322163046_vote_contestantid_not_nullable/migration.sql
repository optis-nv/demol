/*
  Warnings:

  - Made the column `contestantId` on table `Vote` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "episodeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contestantId" TEXT NOT NULL,
    CONSTRAINT "Vote_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Vote_contestantId_fkey" FOREIGN KEY ("contestantId") REFERENCES "Contestant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Vote" ("contestantId", "createdAt", "episodeId", "id", "userId") SELECT "contestantId", "createdAt", "episodeId", "id", "userId" FROM "Vote";
DROP TABLE "Vote";
ALTER TABLE "new_Vote" RENAME TO "Vote";
CREATE UNIQUE INDEX "Vote_episodeId_userId_key" ON "Vote"("episodeId", "userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
