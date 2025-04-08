import { AffectedArea, Truck } from "@prisma/client";

export type AffectedAreaDTO = AffectedArea & { requiredResources: { [key: string]: number } };

export type TruckDTO = Truck & { availableResources: { [key: string]: number } };