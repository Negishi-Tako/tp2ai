/*
  Warnings:

  - You are about to drop the column `BASICAUthPasswd` on the `Env` table. All the data in the column will be lost.
  - Added the required column `BASICAuthPasswd` to the `Env` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Env` DROP COLUMN `BASICAUthPasswd`,
    ADD COLUMN `BASICAuthPasswd` VARCHAR(191) NOT NULL;
