/*
  Warnings:

  - Made the column `end` on table `ControllerPosition` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ControllerPosition" ALTER COLUMN "end" SET NOT NULL;
