
/*
  Warnings:

  - You are about to drop the column `cloudProvider` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `cloudSeedEnabled` on the `Media` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('MOVIE', 'SERIES', 'DOCUMENTARY');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('PENDING', 'READY', 'ERROR');

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "cloudProvider",
DROP COLUMN "cloudSeedEnabled";

-- CreateTable
CREATE TABLE "MediaTorrent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'MOVIE',
    "status" "MediaStatus" NOT NULL DEFAULT 'PENDING',
    "magnet" TEXT,
    "cid" TEXT,
    "manifestUrl" TEXT,
    "thumbnails" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaTorrent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MediaTorrent" ADD CONSTRAINT "MediaTorrent_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
