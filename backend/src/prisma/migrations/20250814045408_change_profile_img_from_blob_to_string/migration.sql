/*
  Warnings:

  - You are about to alter the column `profile_img` on the `users` table. The data in that column could be lost. The data in that column will be cast from `MediumBlob` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `profile_img` VARCHAR(191) NULL;
