import * as truckError from "../errors/truckError";
import * as truckRepo from "../repositories/truckRepository";
import { Truck } from '@prisma/client';
import { TruckDTO } from '../models';

export const getAllTrucks = async (): Promise<TruckDTO[]> => {
    const trucks = await truckRepo.getAllTrucks();
    return trucks.map((truck) => {
        return {
            ...truck,
            availableResources: JSON.parse(truck.availableResources),
            travelTimeToArea: JSON.parse(truck.travelTimeToArea)
        }
    });
}

export const getTruckById = async (truckID: string): Promise<TruckDTO> => {
    const truck = await truckRepo.getTruckByTruckID(truckID);
    if (!truck) {
        throw truckError.TruckNotFoundError(`Truck with truckID '${truckID}' is not found`);
    }
    return {
        ...truck,
        availableResources: JSON.parse(truck.availableResources),
        travelTimeToArea: JSON.parse(truck.travelTimeToArea)
    };
}

export const createTrucks = async (truckData: TruckDTO[]) => {
    const existingTrucks: Truck[] = [];
    const nonExistingTruck = await Promise.all(truckData.map(async (truck) => {
        const existingTruck = await truckRepo.getTruckByTruckID(truck.truckID);
        if (existingTruck) {
            existingTrucks.push(existingTruck);
            return null;
        }
        return truck;
    }
    ));

    const validatedTruck = nonExistingTruck.filter((truck) => truck != null);
    if (validatedTruck.length == 0) {
        throw truckError.TruckAlreadyExistsError(`All trucks already exist`);
    }

    const validatedTruckForCreate: Truck[] = validatedTruck.map(truck => {
        const { availableResources, travelTimeToArea, ...rest } = truck;
        return {
            ...rest,
            availableResources: JSON.stringify(availableResources),
            travelTimeToArea: JSON.stringify(travelTimeToArea)
        }
    });

    const createdTrucks = await truckRepo.createTrucks(validatedTruckForCreate);

    const error = existingTrucks.length > 0 ?
        `${existingTrucks.map(truck => truck.truckID).join(", ")} trucks are already exist`
        : "No error found";

    return {
        message: `${createdTrucks.count} trucks created successfully`,
        error,
    }
}

export const updateTruck = async (truckID: string, truckData: Partial<Truck>) => {
    const existingTruck = await getTruckById(truckID);
    if (!existingTruck) {
        throw truckError.TruckNotFoundError(`Truck with truckID '${truckID}' is not found`);
    }

    const updatedTruck = await truckRepo.updateTruck(truckID, truckData);
    return {
        ...updatedTruck,
        availableResources: JSON.parse(updatedTruck.availableResources),
        travelTimeToArea: JSON.parse(updatedTruck.travelTimeToArea)
    };
}
