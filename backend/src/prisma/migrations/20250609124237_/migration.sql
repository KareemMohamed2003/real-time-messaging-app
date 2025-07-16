/*
  Warnings:

  - You are about to drop the column `receiverId` on the `friends` table. All the data in the column will be lost.
  - You are about to drop the column `receiverName` on the `friends` table. All the data in the column will be lost.
  - You are about to drop the column `request_status` on the `friends` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `friends` table. All the data in the column will be lost.
  - You are about to drop the column `senderName` on the `friends` table. All the data in the column will be lost.
  - You are about to alter the column `createdAt` on the `friends` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - The primary key for the `notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `notificaitonId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `recieverId` on the `notifications` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `friends` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `notificationId` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverId` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `friends` DROP FOREIGN KEY `Friends_receiverId_fkey`;

-- DropForeignKey
ALTER TABLE `friends` DROP FOREIGN KEY `Friends_senderId_fkey`;

-- DropIndex
DROP INDEX `Friends_senderId_receiverId_key` ON `friends`;

-- AlterTable
ALTER TABLE `friends` DROP COLUMN `receiverId`,
    DROP COLUMN `receiverName`,
    DROP COLUMN `request_status`,
    DROP COLUMN `senderId`,
    DROP COLUMN `senderName`,
    ADD COLUMN `name` VARCHAR(255) NULL,
    ADD COLUMN `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `email` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `notifications` DROP PRIMARY KEY,
    DROP COLUMN `notificaitonId`,
    DROP COLUMN `recieverId`,
    ADD COLUMN `notificationId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `receiverId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`notificationId`);

-- CreateIndex
CREATE UNIQUE INDEX `email` ON `friends`(`email`);
