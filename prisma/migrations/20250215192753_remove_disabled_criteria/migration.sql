/*
  Warnings:

  - You are about to drop the column `disabled` on the `TrainingSessionPerformanceIndicatorCriteria` table. All the data in the column will be lost.
  - You are about to drop the `_disabledCriteria` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "PerformanceIndicatorMarker" ADD VALUE 'NOT_OBSERVED';

-- DropForeignKey
ALTER TABLE "_disabledCriteria" DROP CONSTRAINT "_disabledCriteria_A_fkey";

-- DropForeignKey
ALTER TABLE "_disabledCriteria" DROP CONSTRAINT "_disabledCriteria_B_fkey";

-- AlterTable
ALTER TABLE "TrainingSessionPerformanceIndicatorCriteria" DROP COLUMN "disabled";

-- DropTable
DROP TABLE "_disabledCriteria";
