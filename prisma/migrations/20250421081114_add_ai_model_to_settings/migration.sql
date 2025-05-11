-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "openaiApiKey" TEXT,
    "aiModel" TEXT NOT NULL DEFAULT 'gpt-4o',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Settings" ("id", "openaiApiKey", "updatedAt") SELECT "id", "openaiApiKey", "updatedAt" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
