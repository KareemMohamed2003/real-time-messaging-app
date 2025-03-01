-- DropIndex
DROP INDEX `Users_password_key` ON `users`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `status` TINYINT NOT NULL DEFAULT 1,
    MODIFY `profile_img` MEDIUMBLOB NULL;
