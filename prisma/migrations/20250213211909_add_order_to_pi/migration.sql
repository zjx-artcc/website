-- AlterTable
ALTER TABLE "PerformanceIndicatorCriteria"
    ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PerformanceIndicatorCriteriaCategory"
    ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TrainingSessionPerformanceIndicatorCategory"
    ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TrainingSessionPerformanceIndicatorCriteria"
    ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;
