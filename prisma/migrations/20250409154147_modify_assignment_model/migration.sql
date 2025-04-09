/*
  Warnings:

  - You are about to drop the column `areaID` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `resourcesDelivered` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `truckID` on the `Assignment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Assignment` DROP FOREIGN KEY `Assignment_areaID_fkey`;

-- DropForeignKey
ALTER TABLE `Assignment` DROP FOREIGN KEY `Assignment_truckID_fkey`;

-- DropIndex
DROP INDEX `Assignment_areaID_fkey` ON `Assignment`;

-- DropIndex
DROP INDEX `Assignment_truckID_fkey` ON `Assignment`;

-- AlterTable
ALTER TABLE `Assignment` DROP COLUMN `areaID`,
    DROP COLUMN `resourcesDelivered`,
    DROP COLUMN `truckID`,
    ADD COLUMN `affectedAreaId` INTEGER NULL,
    ADD COLUMN `truckId` INTEGER NULL;

-- CreateTable
CREATE TABLE `AssignmentDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `assignmentID` INTEGER NOT NULL,
    `truckID` VARCHAR(191) NOT NULL,
    `areaID` VARCHAR(191) NOT NULL,
    `resourcesDelivered` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_affectedAreaId_fkey` FOREIGN KEY (`affectedAreaId`) REFERENCES `AffectedArea`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_truckId_fkey` FOREIGN KEY (`truckId`) REFERENCES `Truck`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssignmentDetails` ADD CONSTRAINT `AssignmentDetails_assignmentID_fkey` FOREIGN KEY (`assignmentID`) REFERENCES `Assignment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssignmentDetails` ADD CONSTRAINT `AssignmentDetails_areaID_fkey` FOREIGN KEY (`areaID`) REFERENCES `AffectedArea`(`areaID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssignmentDetails` ADD CONSTRAINT `AssignmentDetails_truckID_fkey` FOREIGN KEY (`truckID`) REFERENCES `Truck`(`truckID`) ON DELETE RESTRICT ON UPDATE CASCADE;
