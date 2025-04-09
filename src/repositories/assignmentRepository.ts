import { PrismaClient } from '@prisma/client';

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
