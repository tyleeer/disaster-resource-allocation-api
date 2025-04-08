import { PrismaClient, Truck } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllTrucks = () => {
    return prisma.truck.findMany({});
}

export const getTruckByTruckID = (truckID: string) => {
    return prisma.truck.findUnique({
        where: { truckID },
    });
}

export const createTrucks = (truckData: Truck[]) => {
    return prisma.truck.createMany({
        data: [...truckData],
        skipDuplicates: true,
    });
}