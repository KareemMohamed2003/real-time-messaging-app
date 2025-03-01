/*
  Warnings:

  - You are about to drop the column `friendId` on the `friends` table. All the data in the column will be lost.
  - You are about to drop the column `friend_name` on the `friends` table. All the data in the column will be lost.
  - You are about to drop the column `friend_request` on the `friends` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `friends` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `friends` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[senderId,receiverId]` on the table `Friends` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receiverId` to the `Friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiver_name` to the `Friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `request_status` to the `Friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderName` to the `Friends` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `friends` DROP FOREIGN KEY `Friends_friendId_fkey`;

-- DropForeignKey
ALTER TABLE `friends` DROP FOREIGN KEY `Friends_userId_fkey`;

-- DropIndex
DROP INDEX `Friends_userId_friendId_key` ON `friends`;

-- AlterTable
ALTER TABLE `friends` DROP COLUMN `friendId`,
    DROP COLUMN `friend_name`,
    DROP COLUMN `friend_request`,
    DROP COLUMN `userId`,
    DROP COLUMN `username`,
    ADD COLUMN `receiverId` INTEGER NOT NULL,
    ADD COLUMN `receiver_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `request_status` ENUM('SENT', 'REJECTED', 'ACCEPTED') NOT NULL,
    ADD COLUMN `senderId` INTEGER NULL,
    ADD COLUMN `senderName` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Friends_senderId_receiverId_key` ON `Friends`(`senderId`, `receiverId`);

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
