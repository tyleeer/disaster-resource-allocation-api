import { AffectedArea, Truck, AssignmentDetails } from "@prisma/client";

export type AffectedAreaDTO = AffectedArea & { requiredResources: { [key: string]: number } };

export type TruckDTO = Truck & { availableResources: { [key: string]: number } };

export type AssignmentDetailsDTO = Omit<AssignmentDetails & { resourcesDelivered: { [key: string]: number } }, "id" | "assignmentID">;