/*
  Warnings:

  - The values [SINGLE,SINGLE_SUPPORT,MULTIPLE,MULTIPLE_SUPPORT] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('HOME', 'SUPPORT_REQUIRED', 'SUPPORT_OPTIONAL', 'GROUP_FLIGHT', 'FRIDAY_NIGHT_OPERATIONS', 'SATURDAY_NIGHT_OPERATIONS', 'TRAINING');
ALTER TABLE "Event" ALTER COLUMN "type" TYPE "EventType_new" USING ("type"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "EventType_old";
COMMIT;
