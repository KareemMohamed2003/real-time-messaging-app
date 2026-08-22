-- DropForeignKey
ALTER TABLE `channel` DROP FOREIGN KEY `Channel_roomUUID_fkey`;

-- DropForeignKey
ALTER TABLE `channelparticipant` DROP FOREIGN KEY `ChannelParticipant_channelId_fkey`;

-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `Messages_channelId_fkey`;

-- DropForeignKey
ALTER TABLE `roommember` DROP FOREIGN KEY `RoomMember_roomUUID_fkey`;

-- AddForeignKey
ALTER TABLE `ChannelParticipant` ADD CONSTRAINT `ChannelParticipant_channelId_fkey` FOREIGN KEY (`channelId`) REFERENCES `Channel`(`channelId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_channelId_fkey` FOREIGN KEY (`channelId`) REFERENCES `Channel`(`channelId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Channel` ADD CONSTRAINT `Channel_roomUUID_fkey` FOREIGN KEY (`roomUUID`) REFERENCES `Rooms`(`roomUUID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoomMember` ADD CONSTRAINT `RoomMember_roomUUID_fkey` FOREIGN KEY (`roomUUID`) REFERENCES `Rooms`(`roomUUID`) ON DELETE CASCADE ON UPDATE CASCADE;
