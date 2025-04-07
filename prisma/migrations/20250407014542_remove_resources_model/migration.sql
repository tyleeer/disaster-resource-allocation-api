/*
  Warnings:

  - You are about to drop the `Resource` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `requiredResources` to the `AffectedArea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resourcesDelivered` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableResources` to the `Truck` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Resource` DROP FOREIGN KEY `Resource_areaID_fkey`;

-- DropForeignKey
ALTER TABLE `Resource` DROP FOREIGN KEY `Resource_assignmentID_fkey`;

-- DropForeignKey
ALTER TABLE `Resource` DROP FOREIGN KEY `Resource_truckID_fkey`;

-- AlterTable
ALTER TABLE `AffectedArea` ADD COLUMN `requiredResources` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Assignment` ADD COLUMN `resourcesDelivered` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Truck` ADD COLUMN `availableResources` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Resource`;
