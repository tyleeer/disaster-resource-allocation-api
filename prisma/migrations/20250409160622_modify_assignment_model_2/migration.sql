/*
  Warnings:

  - You are about to drop the column `affectedAreaId` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `truckId` on the `Assignment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Assignment` DROP FOREIGN KEY `Assignment_affectedAreaId_fkey`;

-- DropForeignKey
ALTER TABLE `Assignment` DROP FOREIGN KEY `Assignment_truckId_fkey`;

-- DropIndex
DROP INDEX `Assignment_affectedAreaId_fkey` ON `Assignment`;

-- DropIndex
DROP INDEX `Assignment_truckId_fkey` ON `Assignment`;

-- AlterTable
ALTER TABLE `Assignment` DROP COLUMN `affectedAreaId`,
    DROP COLUMN `truckId`;
