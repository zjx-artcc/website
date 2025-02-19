-- DropForeignKey
ALTER TABLE "PerformanceIndicatorCriteria" DROP CONSTRAINT "PerformanceIndicatorCriteria_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "PerformanceIndicatorCriteriaCategory" DROP CONSTRAINT "PerformanceIndicatorCriteriaCategory_templateId_fkey";

-- AddForeignKey
ALTER TABLE "PerformanceIndicatorCriteriaCategory"
    ADD CONSTRAINT "PerformanceIndicatorCriteriaCategory_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "PerformanceIndicatorTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceIndicatorCriteria"
    ADD CONSTRAINT "PerformanceIndicatorCriteria_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PerformanceIndicatorCriteriaCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
