/*
  Warnings:

  - You are about to drop the `_EpisodeToSeason` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tmdbId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."_EpisodeToSeason" DROP CONSTRAINT "_EpisodeToSeason_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_EpisodeToSeason" DROP CONSTRAINT "_EpisodeToSeason_B_fkey";

-- AlterTable
ALTER TABLE "Episode" ADD COLUMN     "seasonId" INTEGER;

-- DropTable
DROP TABLE "public"."_EpisodeToSeason";

-- CreateIndex
CREATE UNIQUE INDEX "Media_tmdbId_key" ON "Media"("tmdbId");

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE SET NULL ON UPDATE CASCADE;
