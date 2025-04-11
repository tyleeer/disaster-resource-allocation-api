/*
  Warnings:

  - Made the column `requiredResources` on table `AffectedArea` required. This step will fail if there are existing NULL values in that column.
  - Made the column `availableResources` on table `Truck` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `AffectedArea` MODIFY `requiredResources` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Truck` MODIFY `availableResources` VARCHAR(191) NOT NULL;
