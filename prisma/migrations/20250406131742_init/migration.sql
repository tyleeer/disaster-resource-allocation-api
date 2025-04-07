-- CreateTable
CREATE TABLE `AffectedArea` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `areaID` VARCHAR(191) NOT NULL,
    `urgencyLevel` INTEGER NOT NULL,
    `timeConstraint` INTEGER NOT NULL,

    UNIQUE INDEX `AffectedArea_areaID_key`(`areaID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Truck` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `truckID` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Truck_truckID_key`(`truckID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resource` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `areaID` VARCHAR(191) NULL,
    `truckID` VARCHAR(191) NULL,
    `assignmentID` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TimeToArea` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `truckID` VARCHAR(191) NOT NULL,
    `areaID` VARCHAR(191) NOT NULL,
    `travelTime` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Assignment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `truckID` VARCHAR(191) NOT NULL,
    `areaID` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Resource` ADD CONSTRAINT `Resource_areaID_fkey` FOREIGN KEY (`areaID`) REFERENCES `AffectedArea`(`areaID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resource` ADD CONSTRAINT `Resource_truckID_fkey` FOREIGN KEY (`truckID`) REFERENCES `Truck`(`truckID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resource` ADD CONSTRAINT `Resource_assignmentID_fkey` FOREIGN KEY (`assignmentID`) REFERENCES `Assignment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeToArea` ADD CONSTRAINT `TimeToArea_areaID_fkey` FOREIGN KEY (`areaID`) REFERENCES `AffectedArea`(`areaID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeToArea` ADD CONSTRAINT `TimeToArea_truckID_fkey` FOREIGN KEY (`truckID`) REFERENCES `Truck`(`truckID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_areaID_fkey` FOREIGN KEY (`areaID`) REFERENCES `AffectedArea`(`areaID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_truckID_fkey` FOREIGN KEY (`truckID`) REFERENCES `Truck`(`truckID`) ON DELETE RESTRICT ON UPDATE CASCADE;
