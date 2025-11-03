/*
  Warnings:

  - Made the column `paymentSuccessful` on table `LiveRegistrant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "LiveRegistrant" ALTER COLUMN "paymentSuccessful" SET NOT NULL;
