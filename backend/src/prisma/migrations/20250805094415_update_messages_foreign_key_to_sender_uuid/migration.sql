/*
  Warnings:

  - You are about to drop the column `receiverId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `messages` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receiverUUID` to the `Messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderUUID` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `Messages_userId_fkey`;

-- AlterTable
ALTER TABLE `messages` DROP COLUMN `receiverId`,
    DROP COLUMN `senderId`,
    DROP COLUMN `userId`,
    ADD COLUMN `receiverUUID` VARCHAR(191) NOT NULL,
    ADD COLUMN `senderUUID` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Users_uuid_key` ON `Users`(`uuid`);

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_senderUUID_fkey` FOREIGN KEY (`senderUUID`) REFERENCES `Users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
