/*
  Warnings:

  - Added the required column `description` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "bannerKey" TEXT,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "featuredFields" TEXT[];
