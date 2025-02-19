-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "LogModel" ADD VALUE 'PERFORMANCE_INDICATOR_TEMPLATE';
ALTER TYPE "LogModel" ADD VALUE 'PERFORMANCE_INDICATOR_CRITERIA_CATEGORY';
ALTER TYPE "LogModel" ADD VALUE 'PERFORMANCE_INDICATOR_CRITERIA';
ALTER TYPE "LogModel" ADD VALUE 'LESSON_PERFORMANCE_INDICATOR';
