/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Planets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Planets_name_key" ON "Planets"("name");
