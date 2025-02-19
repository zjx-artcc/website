-- DropForeignKey
ALTER TABLE "TrainingSessionPerformanceIndicator" DROP CONSTRAINT "TrainingSessionPerformanceIndicator_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingSessionPerformanceIndicatorCategory" DROP CONSTRAINT "TrainingSessionPerformanceIndicatorCategory_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingSessionPerformanceIndicatorCriteria" DROP CONSTRAINT "TrainingSessionPerformanceIndicatorCriteria_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "TrainingSessionPerformanceIndicator"
    ADD CONSTRAINT "TrainingSessionPerformanceIndicator_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TrainingSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSessionPerformanceIndicatorCategory"
    ADD CONSTRAINT "TrainingSessionPerformanceIndicatorCategory_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TrainingSessionPerformanceIndicator" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSessionPerformanceIndicatorCriteria"
    ADD CONSTRAINT "TrainingSessionPerformanceIndicatorCriteria_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TrainingSessionPerformanceIndicatorCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
