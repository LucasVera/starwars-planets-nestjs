-- CreateTable
CREATE TABLE "Planet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "diameter" TEXT NOT NULL,
    "gravity" TEXT NOT NULL,
    "terrain" TEXT NOT NULL,
    "created" TEXT NOT NULL,
    "edited" TEXT NOT NULL,
    "deletedAt" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Planet_name_key" ON "Planet"("name");
