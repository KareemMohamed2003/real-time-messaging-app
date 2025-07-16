/*
  Warnings:

  - You are about to drop the column `name` on the `friends` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `friends` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[senderId,receiverId]` on the table `Friends` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receiverId` to the `Friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverName` to the `Friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `request_status` to the `Friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderName` to the `Friends` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdAt` on table `friends` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `friends` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `email` ON `friends`;

-- AlterTable
ALTER TABLE `friends` DROP COLUMN `name`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `receiverId` INTEGER NOT NULL,
    ADD COLUMN `receiverName` VARCHAR(191) NOT NULL,
    ADD COLUMN `request_status` ENUM('SENT', 'REJECTED', 'ACCEPTED') NOT NULL,
    ADD COLUMN `senderId` INTEGER NULL,
    ADD COLUMN `senderName` VARCHAR(191) NOT NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `email` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Friends_senderId_receiverId_key` ON `Friends`(`senderId`, `receiverId`);

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
