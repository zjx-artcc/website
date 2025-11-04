-- AlterTable
ALTER TABLE "LiveRegistrant" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripeCustomerId" TEXT;

-- AddForeignKey
ALTER TABLE "LiveRegistrant" ADD CONSTRAINT "LiveRegistrant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
