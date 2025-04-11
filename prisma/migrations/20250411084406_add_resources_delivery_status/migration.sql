-- AlterTable
ALTER TABLE `AffectedArea` ADD COLUMN `resourceDeliveryStatus` ENUM('PENDING', 'COMPLETED') NOT NULL DEFAULT 'PENDING';
