/*
  Warnings:

  - Made the column `roomUUID` on table `channel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `channelName` on table `channel` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `channel` DROP FOREIGN KEY `Channel_roomUUID_fkey`;

-- AlterTable
ALTER TABLE `channel` MODIFY `roomUUID` VARCHAR(191) NOT NULL,
    MODIFY `channelName` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Channel` ADD CONSTRAINT `Channel_roomUUID_fkey` FOREIGN KEY (`roomUUID`) REFERENCES `Rooms`(`roomUUID`) ON DELETE RESTRICT ON UPDATE CASCADE;
