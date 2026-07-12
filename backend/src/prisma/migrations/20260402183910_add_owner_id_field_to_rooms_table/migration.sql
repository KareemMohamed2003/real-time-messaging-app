/*
  Warnings:

  - The required column `ownerId` was added to the `Rooms` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `rooms` ADD COLUMN `ownerId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`roomName`, `ownerId`);
