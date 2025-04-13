import { AffectedArea, Truck, AssignmentDetails } from "@prisma/client";

export type AffectedAreaDTO = AffectedArea & { requiredResources: { [key: string]: number } };

export type TruckDTO = Truck & {
    availableResources: { [key: string]: number },
    travelTimeToArea: { [key: string]: number }
};

export type AssignmentDetailsDTO = Omit<AssignmentDetails & { resourcesDelivered: { [key: string]: number } }, "id" | "assignmentID">;

type AssignmentDetail = {
    areaID: string,
    truckID: string
}

export type ProcessedAssignment = AssignmentDetail & {
    resourcesDelivered: { [key: string]: number }
};

export type CreatProcessedAssignment = AssignmentDetail & {
    resourcesDelivered: string
};

export type RemainingResources = AssignmentDetail & {
    remainingAreaResources: { [key: string]: number },
    remainingTruckResources: { [key: string]: number }
};

export type MatchingRecords = {
    assignments: ProcessedAssignment[],
    remainingResources: RemainingResources[],
    unassignedAreas: string[]
}

export type ProcessedAssignments = {
    message: string,
    error: string,
    assignments: ProcessedAssignment[],
}

export type CachedAssignments = {
    hasCacheData: boolean,
    assignments: ProcessedAssignment[]
}