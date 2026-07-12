-- DropForeignKey
ALTER TABLE `friends` DROP FOREIGN KEY `Friends_receiverId_fkey`;

-- DropForeignKey
ALTER TABLE `friends` DROP FOREIGN KEY `Friends_senderId_fkey`;

-- AlterTable
ALTER TABLE `friends` MODIFY `receiverId` INTEGER NULL,
    MODIFY `receiverName` VARCHAR(191) NULL,
    MODIFY `senderId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
