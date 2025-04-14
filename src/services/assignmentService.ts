import * as assignmentError from "../errors/assignmentError";
import * as assignmentRepo from "../repositories/assignmentRepository";
import { AssignmentDetailsDTO, TruckDTO, AffectedAreaDTO, MatchingRecords, CreatProcessedAssignment, ProcessedAssignment, RemainingResources, ProcessedAssignments, CachedAssignments, ResourceDeliveryStatus } from '../models';
import { getAllAreas, updateArea } from './areaService';
import { getAllTrucks, updateTruck } from './truckService';
import { calculateRemainingResources } from "../utils/assignmentHelpler";
import { setCachedAssignment, deleteCachedAssignment, getCachedAssignments } from "./redisService";
import initializeRedisClient from "../db/redisClient";

export const getLastProcessedAssignments = async (): Promise<ProcessedAssignment[]> => {
    const redisClient = await initializeRedisClient();
    const cache = await getCachedAssignments(redisClient, "assignments:lastProcessed") as CachedAssignments;
    if (cache.hasCacheData) {
        console.log("Assignments data retrieved from cache");
        return cache.assignments;
    }
    const lastProcessedAssignments = await assignmentRepo.getLastProcessedAssignments();
    if (!lastProcessedAssignments) {
        return [] as AssignmentDetailsDTO[];
    }

    const assignments = lastProcessedAssignments.assignmentDetails.map((assignmentDetail) => {
        return {
            areaID: assignmentDetail.areaID,
            truckID: assignmentDetail.truckID,
            resourcesDelivered: JSON.parse(assignmentDetail.resourcesDelivered)
        }
    });

    await setCachedAssignment(redisClient, "assignments:lastProcessed", assignments);
    return assignments;
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

        const redisClient = await initializeRedisClient();
        await Promise.all([
            updateResources(remainingResources),
            setCachedAssignment(redisClient, "assignments:lastProcessed", processedAssignments.assignments)
        ]);
    }

    return {
        message: processedAssignments.message,
        error: processedAssignments.error,
        assignments: processedAssignments.assignments,
    }
}

export const deleteCachedAssignments = async () => {
    const redisClient = await initializeRedisClient();
    const cache = await getCachedAssignments(redisClient, "assignments:lastProcessed");
    if (cache.hasCacheData) {
        await deleteCachedAssignment(redisClient, "assignments:lastProcessed");
    } else {
        console.log("No cached assignment data found to delete");
        throw assignmentError.NoCachedAssignmentError("No cached assignment data found to delete");
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
        if (area.resourceDeliveryStatus === ResourceDeliveryStatus.COMPLETED) return;

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
            resourceDeliveryStatus: ResourceDeliveryStatus.COMPLETED
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