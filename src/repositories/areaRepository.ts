import { PrismaClient, AffectedArea } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllAreas = () => {
    return prisma.affectedArea.findMany({
        orderBy: {
            urgencyLevel: 'desc'
        },
    });
}

export const getAreaByAreaID = (areaID: string) => {
    return prisma.affectedArea.findUnique({
        where: { areaID },
    });
}

export const createAreas = (areaData: AffectedArea[]) => {
    return prisma.affectedArea.createMany({
        data: [...areaData],
        // skipDuplicates: true,
    });
}

export const updateArea = (areaID: string, areaData: Partial<AffectedArea>) => {
    return prisma.affectedArea.update({
        where: { areaID },
        data: areaData,
    });
}