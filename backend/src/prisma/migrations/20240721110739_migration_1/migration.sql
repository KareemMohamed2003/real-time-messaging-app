/*
  Warnings:

  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - Added the required column `profile_img` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Users_name_key` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `name`,
    ADD COLUMN `profile_img` MEDIUMBLOB NOT NULL;
