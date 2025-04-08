/*
  Warnings:

  - You are about to drop the `TimeToArea` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `travelTimeToArea` to the `Truck` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `TimeToArea` DROP FOREIGN KEY `TimeToArea_areaID_fkey`;

-- DropForeignKey
ALTER TABLE `TimeToArea` DROP FOREIGN KEY `TimeToArea_truckID_fkey`;

-- AlterTable
ALTER TABLE `Truck` ADD COLUMN `travelTimeToArea` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `TimeToArea`;
