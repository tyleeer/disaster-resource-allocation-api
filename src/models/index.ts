import { AffectedArea } from "@prisma/client";

export type AffectedAreaDTO = AffectedArea & { requiredResources: { [key: string]: number } };