import { PrismaClient, AffectedArea } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllAreas = () => {
    return prisma.affectedArea.findMany({});
}

export const getAreaByAreaID = (areaID: string) => {
    return prisma.affectedArea.findUnique({
        where: { areaID },
    });
}

export const createAreas = (areaData: AffectedArea[]) => {
    return prisma.affectedArea.createMany({
        data: [...areaData],
        skipDuplicates: true,
    });
}