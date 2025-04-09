import * as assignmentRepo from "../repositories/assignmentRepository";
import { AssignmentDetailsDTO } from '../models';

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
