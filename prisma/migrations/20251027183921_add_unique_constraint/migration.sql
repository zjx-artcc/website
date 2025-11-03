/*
  Warnings:

  - A unique constraint covering the columns `[cid]` on the table `LiveRegistrant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LiveRegistrant_cid_key" ON "LiveRegistrant"("cid");
