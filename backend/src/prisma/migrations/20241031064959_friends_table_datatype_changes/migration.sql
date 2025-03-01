/*
  Warnings:

  - You are about to alter the column `friendship_status` on the `friends` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.
  - Made the column `friend_request` on table `friends` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `friends` MODIFY `friendship_status` BOOLEAN NOT NULL,
    MODIFY `friend_request` ENUM('SENT', 'REJECTED', 'ACCEPTED') NOT NULL;
