import { AffectedArea } from "@prisma/client";

export type AffectedAreaForCreate = AffectedArea & { requiredResources: { [key: string]: number } };