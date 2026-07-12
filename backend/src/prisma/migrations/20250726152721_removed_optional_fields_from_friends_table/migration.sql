/*
  Warnings:

  - Made the column `senderId` on table `friends` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `friends` DROP FOREIGN KEY `Friends_senderId_fkey`;

-- AlterTable
ALTER TABLE `friends` MODIFY `senderId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
