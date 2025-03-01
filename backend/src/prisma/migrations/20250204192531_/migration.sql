-- AlterTable
ALTER TABLE `friends` ADD COLUMN `usersId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
