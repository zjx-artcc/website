/*
  Warnings:

  - You are about to drop the column `message` on the `ChangeBroadcast` table. All the data in the column will be lost.
  - You are about to drop the column `optional` on the `ChangeBroadcast` table. All the data in the column will be lost.
  - Added the required column `description` to the `ChangeBroadcast` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `ChangeBroadcast` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChangeBroadcast" DROP COLUMN "message",
DROP
COLUMN "optional",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
