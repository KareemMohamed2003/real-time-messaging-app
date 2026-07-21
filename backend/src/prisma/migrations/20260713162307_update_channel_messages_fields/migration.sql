-- DropForeignKey
ALTER TABLE `channel` DROP FOREIGN KEY `Channel_roomUUID_fkey`;

-- AlterTable
ALTER TABLE `channel` MODIFY `roomUUID` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Channel` ADD CONSTRAINT `Channel_roomUUID_fkey` FOREIGN KEY (`roomUUID`) REFERENCES `Rooms`(`roomUUID`) ON DELETE SET NULL ON UPDATE CASCADE;
