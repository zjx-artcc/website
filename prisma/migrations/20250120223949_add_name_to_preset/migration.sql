/*
  Warnings:

  - Added the required column `name` to the `EventPositionPreset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventPositionPreset" ADD COLUMN     "name" TEXT NOT NULL;
