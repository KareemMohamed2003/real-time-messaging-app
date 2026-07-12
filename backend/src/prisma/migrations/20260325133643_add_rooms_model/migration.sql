/*
  Warnings:

  - Added the required column `channelId` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `messages` ADD COLUMN `channelId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `ChannelParticipant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `channelId` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ChannelParticipant_channelId_userId_key`(`channelId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Channel` (
    `channelId` INTEGER NOT NULL AUTO_INCREMENT,
    `roomUUID` VARCHAR(191) NULL,
    `channelName` VARCHAR(191) NULL,
    `type` ENUM('TEXT', 'VOICE', 'DIRECT_MESSAGE') NOT NULL DEFAULT 'DIRECT_MESSAGE',

    INDEX `Channel_type_idx`(`type`),
    PRIMARY KEY (`channelId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rooms` (
    `roomName` VARCHAR(191) NOT NULL,
    `roomUUID` VARCHAR(191) NOT NULL,
    `icon` LONGBLOB NULL,

    UNIQUE INDEX `Rooms_roomName_key`(`roomName`),
    UNIQUE INDEX `Rooms_roomUUID_key`(`roomUUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoomMember` (
    `roomUUID` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'OWNER', 'MEMBER') NOT NULL,

    PRIMARY KEY (`roomUUID`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChannelParticipant` ADD CONSTRAINT `ChannelParticipant_channelId_fkey` FOREIGN KEY (`channelId`) REFERENCES `Channel`(`channelId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_channelId_fkey` FOREIGN KEY (`channelId`) REFERENCES `Channel`(`channelId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Channel` ADD CONSTRAINT `Channel_roomUUID_fkey` FOREIGN KEY (`roomUUID`) REFERENCES `Rooms`(`roomUUID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoomMember` ADD CONSTRAINT `RoomMember_roomUUID_fkey` FOREIGN KEY (`roomUUID`) REFERENCES `Rooms`(`roomUUID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoomMember` ADD CONSTRAINT `RoomMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
