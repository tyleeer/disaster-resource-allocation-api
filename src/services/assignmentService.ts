import * as assignmentError from "../errors/assignmentError";
import * as assignmentRepo from "../repositories/assignmentRepository";
import { AssignmentDetailsDTO, TruckDTO, AffectedAreaDTO, MatchingRecords, CreatProcessedAssignment, ProcessedAssignment, RemainingResources, ProcessedAssignments } from '../models';
import { getAllAreas, updateArea } from './areaService';
import { getAllTrucks, updateTruck } from './truckService';
import { calculateRemainingResources } from "../utils/assignmentHelpler";
import { ResourceDelivertyStatus } from "@prisma/client";

export const getLastProcessedAssignments = async (): Promise<AssignmentDetailsDTO[]> => {
    const lastProcessedAssignments = await assignmentRepo.getLastProcessedAssignments();
    if (!lastProcessedAssignments) {
        return [] as AssignmentDetailsDTO[];
    }

    return lastProcessedAssignments.assignmentDetails.map((assignmentDetail) => {
        return {
            areaID: assignmentDetail.areaID,
            truckID: assignmentDetail.truckID,
            resourcesDelivered: JSON.parse(assignmentDetail.resourcesDelivered)
        }
    });
}

export const processAssignments = async () => {
    const [areas, trucks] = await Promise.all([getAllAreas(), getAllTrucks()]);

    const processedAssignments: ProcessedAssignments = {
        message: "No assignment created",
        error: "No error found",
        assignments: []
    };

    if (areas.length === 0 || trucks.length === 0) {
        throw assignmentError.AreaOrTruckNotFoundError("Area or truck not found for assignment processing");
    }

    const { assignments, remainingResources, unassignedAreas } = resourcesMatching(areas, trucks);

    if (unassignedAreas.length > 0) {
        processedAssignments.error = `${unassignedAreas.join(", ")} did not match with any truck`;
    }

    if (assignments.length > 0) {
        const createdAssignments = await createAssignments(assignments);
        processedAssignments.message = `${createdAssignments.length} assignments created successfully`;
        processedAssignments.assignments = createdAssignments.map((assignment) => {
            return {
                areaID: assignment.areaID,
                truckID: assignment.truckID,
                resourcesDelivered: JSON.parse(assignment.resourcesDelivered)
            }
        });

        await updateResources(remainingResources);
    }

    return {
        message: processedAssignments.message,
        error: processedAssignments.error,
        assignments: processedAssignments.assignments,
    }
}

const resourcesMatching = (areas: AffectedAreaDTO[], trucks: TruckDTO[]): MatchingRecords => {
    const matchingRecords: MatchingRecords = {
        assignments: [],
        remainingResources: [],
        unassignedAreas: []
    };

    const availableTrucks = [...trucks];

    areas.forEach((area) => {
        if (area.resourceDeliveryStatus === ResourceDelivertyStatus.COMPLETED) return;

        const [fristMatchedTruck] = trucks.filter((truck) => {
            return Object.keys(area.requiredResources).every((key) => {
                return truck.availableResources[key] &&
                    truck.availableResources[key] >= area.requiredResources[key] &&
                    truck.travelTimeToArea[area.areaID] &&
                    truck.travelTimeToArea[area.areaID] <= area.timeConstraint;
            });
        }).sort((a, b) => {
            return a.travelTimeToArea[area.areaID] - b.travelTimeToArea[area.areaID];
        });

        if (fristMatchedTruck) {
            const remainingTruckResources = calculateRemainingResources(fristMatchedTruck.availableResources, area.requiredResources);
            const remainingAreaResources = calculateRemainingResources(area.requiredResources, fristMatchedTruck.availableResources);

            matchingRecords.remainingResources.push({
                areaID: area.areaID,
                remainingAreaResources,
                truckID: fristMatchedTruck.truckID,
                remainingTruckResources,
            })
            matchingRecords.assignments.push({
                areaID: area.areaID,
                truckID: fristMatchedTruck.truckID,
                resourcesDelivered: area.requiredResources
            });

            availableTrucks.splice(availableTrucks.indexOf(fristMatchedTruck), 1);
        } else {
            matchingRecords.unassignedAreas.push(area.areaID);
        }
    });

    return matchingRecords;
}

const createAssignments = (assignments: ProcessedAssignment[]) => {
    const assignmentDetails: CreatProcessedAssignment[] = assignments.map((assignment) => {
        return {
            ...assignment,
            resourcesDelivered: JSON.stringify(assignment.resourcesDelivered)
        }
    });

    return assignmentRepo.createAssignments(assignmentDetails);
}

const updateResources = async (remainingResources: RemainingResources[]) => {
    const updateAreas = remainingResources.map((remainingResource) => {
        return updateArea(remainingResource.areaID, {
            requiredResources: JSON.stringify(remainingResource.remainingAreaResources),
            resourceDeliveryStatus: ResourceDelivertyStatus.COMPLETED
        });
    });

    const updateTrucks = remainingResources.map((remainingResource) => {
        return updateTruck(remainingResource.truckID, {
            availableResources: JSON.stringify(remainingResource.remainingTruckResources)
        });
    });

    await Promise.all([
        ...updateAreas,
        ...updateTrucks
    ]);
}