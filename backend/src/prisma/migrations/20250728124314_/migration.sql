/*
  Warnings:

  - You are about to drop the column `recieverId` on the `messages` table. All the data in the column will be lost.
  - Added the required column `receiverId` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `messages` DROP COLUMN `recieverId`,
    ADD COLUMN `receiverId` VARCHAR(191) NOT NULL;
