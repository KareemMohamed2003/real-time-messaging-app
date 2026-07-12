/*
  Warnings:

  - Made the column `receiverId` on table `friends` required. This step will fail if there are existing NULL values in that column.
  - Made the column `receiverName` on table `friends` required. This step will fail if there are existing NULL values in that column.
  - Made the column `senderId` on table `friends` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `message` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `friends` DROP FOREIGN KEY `Friends_receiverId_fkey`;

-- DropForeignKey
ALTER TABLE `friends` DROP FOREIGN KEY `Friends_senderId_fkey`;

-- AlterTable
ALTER TABLE `friends` MODIFY `receiverId` INTEGER NOT NULL,
    MODIFY `receiverName` VARCHAR(191) NOT NULL,
    MODIFY `senderId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `messages` ADD COLUMN `message` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
