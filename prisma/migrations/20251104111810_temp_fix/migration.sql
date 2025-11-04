/*
  Warnings:

  - You are about to drop the column `userId` on the `LiveRegistrant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LiveRegistrant" DROP CONSTRAINT "LiveRegistrant_userId_fkey";

-- AlterTable
ALTER TABLE "LiveRegistrant" DROP COLUMN "userId",
ADD COLUMN     "userId_temp" TEXT;

-- AddForeignKey
ALTER TABLE "LiveRegistrant" ADD CONSTRAINT "LiveRegistrant_userId_temp_fkey" FOREIGN KEY ("userId_temp") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
