BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ResourceDeliveryStatus] (
    [id] INT NOT NULL IDENTITY(1,1),
    [value] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [ResourceDeliveryStatus_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ResourceDeliveryStatus_value_key] UNIQUE NONCLUSTERED ([value])
);

-- CreateTable
CREATE TABLE [dbo].[AffectedArea] (
    [id] INT NOT NULL IDENTITY(1,1),
    [areaID] NVARCHAR(1000) NOT NULL,
    [urgencyLevel] INT NOT NULL,
    [timeConstraint] INT NOT NULL,
    [requiredResources] NVARCHAR(1000) NOT NULL,
    [resourceDeliveryID] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [AffectedArea_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AffectedArea_areaID_key] UNIQUE NONCLUSTERED ([areaID])
);

-- CreateTable
CREATE TABLE [dbo].[Truck] (
    [id] INT NOT NULL IDENTITY(1,1),
    [truckID] NVARCHAR(1000) NOT NULL,
    [availableResources] NVARCHAR(1000) NOT NULL,
    [travelTimeToArea] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Truck_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Truck_truckID_key] UNIQUE NONCLUSTERED ([truckID])
);

-- CreateTable
CREATE TABLE [dbo].[Assignment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Assignment_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deletedAt] DATETIME2,
    CONSTRAINT [Assignment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AssignmentDetails] (
    [id] INT NOT NULL IDENTITY(1,1),
    [assignmentID] INT NOT NULL,
    [areaID] NVARCHAR(1000) NOT NULL,
    [truckID] NVARCHAR(1000) NOT NULL,
    [resourcesDelivered] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [AssignmentDetails_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[AffectedArea] ADD CONSTRAINT [AffectedArea_resourceDeliveryID_fkey] FOREIGN KEY ([resourceDeliveryID]) REFERENCES [dbo].[ResourceDeliveryStatus]([value]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AssignmentDetails] ADD CONSTRAINT [AssignmentDetails_assignmentID_fkey] FOREIGN KEY ([assignmentID]) REFERENCES [dbo].[Assignment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AssignmentDetails] ADD CONSTRAINT [AssignmentDetails_areaID_fkey] FOREIGN KEY ([areaID]) REFERENCES [dbo].[AffectedArea]([areaID]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AssignmentDetails] ADD CONSTRAINT [AssignmentDetails_truckID_fkey] FOREIGN KEY ([truckID]) REFERENCES [dbo].[Truck]([truckID]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
