-- CreateTable
CREATE TABLE "ChangeBroadcast"
(
    "id"        TEXT         NOT NULL,
    "message"   TEXT         NOT NULL,
    "fileId"    TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "optional"  BOOLEAN      NOT NULL,

    CONSTRAINT "ChangeBroadcast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_agreedByUsers"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_seenByUsers"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_unseenByUsers"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_agreedByUsers_AB_unique" ON "_agreedByUsers" ("A", "B");

-- CreateIndex
CREATE INDEX "_agreedByUsers_B_index" ON "_agreedByUsers" ("B");

-- CreateIndex
CREATE UNIQUE INDEX "_seenByUsers_AB_unique" ON "_seenByUsers" ("A", "B");

-- CreateIndex
CREATE INDEX "_seenByUsers_B_index" ON "_seenByUsers" ("B");

-- CreateIndex
CREATE UNIQUE INDEX "_unseenByUsers_AB_unique" ON "_unseenByUsers" ("A", "B");

-- CreateIndex
CREATE INDEX "_unseenByUsers_B_index" ON "_unseenByUsers" ("B");

-- AddForeignKey
ALTER TABLE "ChangeBroadcast"
    ADD CONSTRAINT "ChangeBroadcast_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_agreedByUsers"
    ADD CONSTRAINT "_agreedByUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "ChangeBroadcast" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_agreedByUsers"
    ADD CONSTRAINT "_agreedByUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_seenByUsers"
    ADD CONSTRAINT "_seenByUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "ChangeBroadcast" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_seenByUsers"
    ADD CONSTRAINT "_seenByUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_unseenByUsers"
    ADD CONSTRAINT "_unseenByUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "ChangeBroadcast" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_unseenByUsers"
    ADD CONSTRAINT "_unseenByUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
