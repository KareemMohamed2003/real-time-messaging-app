-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_receiverUUID_fkey` FOREIGN KEY (`receiverUUID`) REFERENCES `Users`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;
