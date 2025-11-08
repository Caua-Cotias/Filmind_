-- AlterEnum
ALTER TYPE "MediaType" ADD VALUE 'TV';

-- CreateTable
CREATE TABLE "Episode" (
    "id" SERIAL NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "season" INTEGER NOT NULL,
    "episodeNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "synopsis" TEXT,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Episode_mediaId_season_episodeNumber_key" ON "Episode"("mediaId", "season", "episodeNumber");

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
