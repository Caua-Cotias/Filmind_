/*
  Warnings:

  - A unique constraint covering the columns `[userId,tmdbId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Media_tmdbId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Media_userId_tmdbId_key" ON "Media"("userId", "tmdbId");
