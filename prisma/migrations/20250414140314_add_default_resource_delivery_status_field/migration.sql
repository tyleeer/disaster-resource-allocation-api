BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AffectedArea] ADD CONSTRAINT [AffectedArea_resourceDeliveryStatus_df] DEFAULT 0 FOR [resourceDeliveryStatus];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
