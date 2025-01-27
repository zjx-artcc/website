-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('SINGLE', 'SINGLE_SUPPORT', 'MULTIPLE', 'MULTIPLE_SUPPORT', 'GROUP_FLIGHT', 'TRAINING');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT true,
    "positionsLocked" BOOLEAN NOT NULL DEFAULT false,
    "manualPositionsOpen" BOOLEAN NOT NULL DEFAULT false,
    "archived" TIMESTAMP(3),
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventPosition" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT,
    "requestedPosition" TEXT NOT NULL,
    "notes" TEXT,
    "requestedStartTime" TIMESTAMP(3) NOT NULL,
    "requestedEndTime" TIMESTAMP(3) NOT NULL,
    "finalStartTime" TIMESTAMP(3),
    "finalEndTime" TIMESTAMP(3),
    "finalPosition" TEXT,
    "finalNotes" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EventPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventPositionPreset" (
    "id" TEXT NOT NULL,
    "positions" TEXT[],

    CONSTRAINT "EventPositionPreset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventPosition_eventId_userId_key" ON "EventPosition"("eventId", "userId");

-- AddForeignKey
ALTER TABLE "EventPosition" ADD CONSTRAINT "EventPosition_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPosition" ADD CONSTRAINT "EventPosition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
