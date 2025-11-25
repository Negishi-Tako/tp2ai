/*
  Warnings:

  - You are about to drop the column `timestamp` on the `ChatMessage` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `ChatMessage` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `ChatMessage` DROP COLUMN `timestamp`,
    MODIFY `role` ENUM('user', 'assistant', 'system') NOT NULL;
