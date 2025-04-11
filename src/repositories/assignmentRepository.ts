import { PrismaClient } from '@prisma/client';
import { CreatProcessedAssignment } from '../models';

const prisma = new PrismaClient();

export const getLastProcessedAssignments = async () => {
    const [lastProcessedAssignment] = await prisma.assignment.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        take: 1,
        include: {
            assignmentDetails: true
        },
    });
    return lastProcessedAssignment;
}

export const createAssignments = async (processedAssignments: CreatProcessedAssignment[]) => {
    const assignment = await prisma.assignment.create({
        data: {
            assignmentDetails: {
                create: processedAssignments
            }
        }
    });

    return prisma.assignmentDetails.findMany({
        where: { assignmentID: assignment.id }
    })
}