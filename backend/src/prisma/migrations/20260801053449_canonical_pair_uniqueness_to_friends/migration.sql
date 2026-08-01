/*
  Warnings:

  - A unique constraint covering the columns `[userAId,userBId]` on the table `Friends` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userAId` to the `Friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userBId` to the `Friends` table without a default value. This is not possible if the table is not empty.

*/


-- AlterTable
ALTER TABLE `friends` ADD COLUMN `userAId` INTEGER NOT NULL,
    ADD COLUMN `userBId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Friends_senderId_idx` ON `Friends`(`senderId`);

-- CreateIndex
CREATE UNIQUE INDEX `Friends_userAId_userBId_key` ON `Friends`(`userAId`, `userBId`);

-- DropIndex
DROP INDEX `Friends_senderId_receiverId_key` ON `friends`;

-- RenameIndex
ALTER TABLE `friends` RENAME INDEX `Friends_receiverId_fkey` TO `Friends_receiverId_idx`;
