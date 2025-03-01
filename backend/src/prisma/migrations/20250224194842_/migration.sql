/*
  Warnings:

  - You are about to alter the column `friendId` on the `friends` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[userId,friendId]` on the table `Friends` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `friends` DROP FOREIGN KEY `Friends_userId_fkey`;

-- AlterTable
ALTER TABLE `friends` MODIFY `friendId` INTEGER NOT NULL,
    MODIFY `userId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Friends_userId_friendId_key` ON `Friends`(`userId`, `friendId`);

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_friendId_fkey` FOREIGN KEY (`friendId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
