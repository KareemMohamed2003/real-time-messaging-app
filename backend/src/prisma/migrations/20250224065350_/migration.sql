/*
  Warnings:

  - Made the column `userId` on table `friends` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `friends` DROP FOREIGN KEY `Friends_userId_fkey`;

-- AlterTable
ALTER TABLE `friends` MODIFY `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
