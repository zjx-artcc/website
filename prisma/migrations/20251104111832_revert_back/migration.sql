/*
  Warnings:

  - You are about to drop the column `userId_temp` on the `LiveRegistrant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LiveRegistrant" DROP CONSTRAINT "LiveRegistrant_userId_temp_fkey";

-- AlterTable
ALTER TABLE "LiveRegistrant" DROP COLUMN "userId_temp",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "LiveRegistrant" ADD CONSTRAINT "LiveRegistrant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
