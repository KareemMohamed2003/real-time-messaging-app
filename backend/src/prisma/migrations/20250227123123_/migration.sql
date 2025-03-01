/*
  Warnings:

  - You are about to drop the column `receiver_name` on the `friends` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `message_id` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `reciever_id` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `sender_id` on the `messages` table. All the data in the column will be lost.
  - The primary key for the `notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_on` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `entity_id` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `notificaiton_id` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `notification_type` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `reciever_id` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `sender_id` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `receiverName` to the `Friends` table without a default value. This is not possible if the table is not empty.
  - The required column `messageId` was added to the `Messages` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `recieverId` to the `Messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityId` to the `Notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notificaitonId` to the `Notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notificationType` to the `Notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recieverId` to the `Notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `friends` DROP COLUMN `receiver_name`,
    ADD COLUMN `receiverName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `messages` DROP COLUMN `created_at`,
    DROP COLUMN `message_id`,
    DROP COLUMN `reciever_id`,
    DROP COLUMN `sender_id`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `messageId` VARCHAR(191) NOT NULL,
    ADD COLUMN `recieverId` VARCHAR(191) NOT NULL,
    ADD COLUMN `senderId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `notifications` DROP PRIMARY KEY,
    DROP COLUMN `created_on`,
    DROP COLUMN `entity_id`,
    DROP COLUMN `notificaiton_id`,
    DROP COLUMN `notification_type`,
    DROP COLUMN `reciever_id`,
    DROP COLUMN `sender_id`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `entityId` VARCHAR(191) NOT NULL,
    ADD COLUMN `notificaitonId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `notificationType` VARCHAR(191) NOT NULL,
    ADD COLUMN `recieverId` VARCHAR(191) NOT NULL,
    ADD COLUMN `senderId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`notificaitonId`);
