/*
  Warnings:

  - You are about to drop the column `cloudPath` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `durationSeconds` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `filesize` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `imdbId` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `moderationStatus` on the `Media` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Media" DROP CONSTRAINT "Media_userId_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "cloudPath",
DROP COLUMN "durationSeconds",
DROP COLUMN "filesize",
DROP COLUMN "imdbId",
DROP COLUMN "moderationStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Media_userId_key" ON "Media"("userId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
