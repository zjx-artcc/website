/*
  Warnings:

  - You are about to drop the column `activeCenterName` on the `CenterSectors` table. All the data in the column will be lost.
  - You are about to drop the column `sectorName` on the `CenterSectors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CenterSectors" DROP COLUMN "activeCenterName",
DROP COLUMN "sectorName",
ADD COLUMN     "activeSectorId" INTEGER;
