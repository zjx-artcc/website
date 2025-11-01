-- CreateEnum
CREATE TYPE "RegistrantType" AS ENUM ('HOME', 'VISITING', 'ACE_TEAM');

-- CreateEnum
CREATE TYPE "LiveShirtSize" AS ENUM ('S', 'M', 'L', 'XL', 'XXL', 'XXXL');

-- CreateTable
CREATE TABLE "LiveRegistrant" (
    "id" TEXT NOT NULL,
    "fName" TEXT NOT NULL,
    "lName" TEXT NOT NULL,
    "preferredName" TEXT NOT NULL,
    "registrantType" "RegistrantType" NOT NULL,
    "attendingLive" BOOLEAN NOT NULL,
    "orderingShirt" BOOLEAN NOT NULL,
    "usingHotelLink" BOOLEAN NOT NULL,

    CONSTRAINT "LiveRegistrant_pkey" PRIMARY KEY ("id")
);
