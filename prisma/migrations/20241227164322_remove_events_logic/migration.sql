/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventPosition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EventPositionToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventPosition" DROP CONSTRAINT "EventPosition_eventId_fkey";

-- DropForeignKey
ALTER TABLE "_EventPositionToUser" DROP CONSTRAINT "_EventPositionToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventPositionToUser" DROP CONSTRAINT "_EventPositionToUser_B_fkey";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "EventPosition";

-- DropTable
DROP TABLE "_EventPositionToUser";

-- DropEnum
DROP TYPE "EventType";
