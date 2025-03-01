/*
  Warnings:

  - Added the required column `friend_name` to the `Friends` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Friends_email_key` ON `friends`;

-- AlterTable
ALTER TABLE `friends` ADD COLUMN `friend_name` VARCHAR(191) NOT NULL;
