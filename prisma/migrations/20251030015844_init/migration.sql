/*
  Warnings:

  - You are about to drop the `MediaTorrent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MediaTorrent" DROP CONSTRAINT "MediaTorrent_ownerId_fkey";

-- DropIndex
DROP INDEX "public"."Media_userId_key";

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "cid" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "manifestUrl" TEXT,
ADD COLUMN     "thumbnails" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "type" "MediaType" NOT NULL DEFAULT 'MOVIE';

-- DropTable
DROP TABLE "public"."MediaTorrent";
