import { AffectedArea } from '@prisma/client';
import * as areaError from "../errors/areaError";
import * as areaRepo from "../repositories/areaRepository";
import { AffectedAreaForCreate } from '../models';

export const getAllAreas = () => {
    return areaRepo.getAllAreas();
}

export const getAreaById = async (areaID: string) => {
    const area = await areaRepo.getAreaByAreaID(areaID);
    if (!area) {
        throw areaError.AreaNotFoundError(`Area with areaID "${areaID}" is not found`);
    }
    return area;
}

export const createAreas = async (areaData: AffectedAreaForCreate[]) => {
    const existingAreas: AffectedArea[] = [];
    const nonExistingArea = await Promise.all(areaData.map(async (area) => {
        const existingArea = await areaRepo.getAreaByAreaID(area.areaID);
        if (existingArea) {
            existingAreas.push(existingArea);
            return null;
        }
        return area;
    }
    ));

    const validatedArea = nonExistingArea.filter((area) => area != null);
    if (validatedArea.length == 0) {
        throw areaError.AreaAlreadyExistsError(`All areas already exist`);
    }

    const validatedAreaForCreate: AffectedArea[] = validatedArea.map(area => {
        const { requiredResources, ...rest } = area;
        return {
            ...rest,
            requiredResources: JSON.stringify(requiredResources)
        }
    });

    const createdAreas = await areaRepo.createAreas(validatedAreaForCreate);

    const errorMessage = existingAreas.length > 0 ?
        `${existingAreas.map(area => area.areaID).join(", ")} areas are already exist`
        : "No error found";

    return {
        message: {
            error: errorMessage,
            success: `${createdAreas.count} areas created successfully!`,
        }
    }
}