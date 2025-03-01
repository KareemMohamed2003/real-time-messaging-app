/*
  Warnings:

  - You are about to drop the column `usersId` on the `friends` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `friends` DROP FOREIGN KEY `Friends_usersId_fkey`;

-- AlterTable
ALTER TABLE `friends` DROP COLUMN `usersId`,
    ADD COLUMN `userId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Notifications` (
    `notificaiton_id` INTEGER NOT NULL AUTO_INCREMENT,
    `notification_type` VARCHAR(191) NOT NULL,
    `sender_id` VARCHAR(191) NOT NULL,
    `reciever_id` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `entity` VARCHAR(191) NOT NULL,
    `entity_id` VARCHAR(191) NOT NULL,
    `created_on` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`notificaiton_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
