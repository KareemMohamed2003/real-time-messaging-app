/*
  Warnings:

  - You are about to alter the column `icon` on the `rooms` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `rooms` MODIFY `icon` VARCHAR(191) NULL;
