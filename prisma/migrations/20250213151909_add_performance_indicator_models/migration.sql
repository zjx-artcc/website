-- CreateEnum
CREATE TYPE "PerformanceIndicatorMarker" AS ENUM ('OBSERVED', 'SATISFACTORY', 'NEEDS_IMPROVEMENT', 'UNSATISFACTORY');

-- AlterTable
ALTER TABLE "Lesson"
    ADD COLUMN "performanceIndicatorId" TEXT;

-- AlterTable
ALTER TABLE "_TrainingAssignmentOtherTrainers"
    ADD CONSTRAINT "_TrainingAssignmentOtherTrainers_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_TrainingAssignmentOtherTrainers_AB_unique";

-- AlterTable
ALTER TABLE "_TrainingAssignmentRequestInterestedTrainers"
    ADD CONSTRAINT "_TrainingAssignmentRequestInterestedTrainers_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_TrainingAssignmentRequestInterestedTrainers_AB_unique";

-- AlterTable
ALTER TABLE "_agreedByUsers"
    ADD CONSTRAINT "_agreedByUsers_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_agreedByUsers_AB_unique";

-- AlterTable
ALTER TABLE "_seenByUsers"
    ADD CONSTRAINT "_seenByUsers_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_seenByUsers_AB_unique";

-- AlterTable
ALTER TABLE "_unseenByUsers"
    ADD CONSTRAINT "_unseenByUsers_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_unseenByUsers_AB_unique";

-- CreateTable
CREATE TABLE "PerformanceIndicatorTemplate"
(
    "id"   TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PerformanceIndicatorTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceIndicatorCriteriaCategory"
(
    "id"         TEXT NOT NULL,
    "name"       TEXT NOT NULL,
    "templateId" TEXT NOT NULL,

    CONSTRAINT "PerformanceIndicatorCriteriaCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceIndicatorCriteria"
(
    "id"         TEXT NOT NULL,
    "name"       TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "PerformanceIndicatorCriteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonPerformanceIndicator"
(
    "id"         TEXT NOT NULL,
    "lessonId"   TEXT NOT NULL,
    "templateId" TEXT NOT NULL,

    CONSTRAINT "LessonPerformanceIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingSessionPerformanceIndicator"
(
    "id"        TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "TrainingSessionPerformanceIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingSessionPerformanceIndicatorCategory"
(
    "id"        TEXT NOT NULL,
    "name"      TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "TrainingSessionPerformanceIndicatorCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingSessionPerformanceIndicatorCriteria"
(
    "id"         TEXT    NOT NULL,
    "name"       TEXT    NOT NULL,
    "disabled"   BOOLEAN NOT NULL,
    "marker"     "PerformanceIndicatorMarker",
    "comments"   TEXT,
    "categoryId" TEXT    NOT NULL,

    CONSTRAINT "TrainingSessionPerformanceIndicatorCriteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_disabledCriteria"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_disabledCriteria_AB_pkey" PRIMARY KEY ("A", "B")
);

-- CreateIndex
CREATE UNIQUE INDEX "LessonPerformanceIndicator_lessonId_key" ON "LessonPerformanceIndicator" ("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingSessionPerformanceIndicator_sessionId_key" ON "TrainingSessionPerformanceIndicator" ("sessionId");

-- CreateIndex
CREATE INDEX "_disabledCriteria_B_index" ON "_disabledCriteria" ("B");

-- AddForeignKey
ALTER TABLE "PerformanceIndicatorCriteriaCategory"
    ADD CONSTRAINT "PerformanceIndicatorCriteriaCategory_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "PerformanceIndicatorTemplate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceIndicatorCriteria"
    ADD CONSTRAINT "PerformanceIndicatorCriteria_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PerformanceIndicatorCriteriaCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonPerformanceIndicator"
    ADD CONSTRAINT "LessonPerformanceIndicator_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonPerformanceIndicator"
    ADD CONSTRAINT "LessonPerformanceIndicator_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "PerformanceIndicatorTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSessionPerformanceIndicator"
    ADD CONSTRAINT "TrainingSessionPerformanceIndicator_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TrainingSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSessionPerformanceIndicatorCategory"
    ADD CONSTRAINT "TrainingSessionPerformanceIndicatorCategory_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TrainingSessionPerformanceIndicator" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSessionPerformanceIndicatorCriteria"
    ADD CONSTRAINT "TrainingSessionPerformanceIndicatorCriteria_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TrainingSessionPerformanceIndicatorCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_disabledCriteria"
    ADD CONSTRAINT "_disabledCriteria_A_fkey" FOREIGN KEY ("A") REFERENCES "LessonPerformanceIndicator" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_disabledCriteria"
    ADD CONSTRAINT "_disabledCriteria_B_fkey" FOREIGN KEY ("B") REFERENCES "PerformanceIndicatorCriteria" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
