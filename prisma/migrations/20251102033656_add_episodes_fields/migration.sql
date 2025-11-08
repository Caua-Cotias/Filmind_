/*
  Warnings:

  - You are about to drop the column `seasonId` on the `Episode` table. All the data in the column will be lost.
  - You are about to drop the column `cid` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `manifestUrl` on the `Media` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mediaId,seasonNumber]` on the table `Season` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Episode" DROP CONSTRAINT "Episode_seasonId_fkey";

-- AlterTable
ALTER TABLE "Episode" DROP COLUMN "seasonId";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "cid",
DROP COLUMN "manifestUrl";

-- CreateTable
CREATE TABLE "_EpisodeToSeason" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EpisodeToSeason_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EpisodeToSeason_B_index" ON "_EpisodeToSeason"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Season_mediaId_seasonNumber_key" ON "Season"("mediaId", "seasonNumber");

-- AddForeignKey
ALTER TABLE "_EpisodeToSeason" ADD CONSTRAINT "_EpisodeToSeason_A_fkey" FOREIGN KEY ("A") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EpisodeToSeason" ADD CONSTRAINT "_EpisodeToSeason_B_fkey" FOREIGN KEY ("B") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;
