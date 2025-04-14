/*
  Warnings:

  - You are about to drop the column `resourceDeliveryID` on the `AffectedArea` table. All the data in the column will be lost.
  - You are about to drop the `ResourceDeliveryStatus` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `resourceDeliveryStatus` to the `AffectedArea` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[AffectedArea] DROP CONSTRAINT [AffectedArea_resourceDeliveryID_fkey];

-- AlterTable
ALTER TABLE [dbo].[AffectedArea] DROP COLUMN [resourceDeliveryID];
ALTER TABLE [dbo].[AffectedArea] ADD [resourceDeliveryStatus] INT NOT NULL;

-- DropTable
DROP TABLE [dbo].[ResourceDeliveryStatus];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
