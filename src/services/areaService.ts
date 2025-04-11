import { AffectedArea } from '@prisma/client';
import * as areaError from "../errors/areaError";
import * as areaRepo from "../repositories/areaRepository";
import { AffectedAreaDTO } from '../models';

export const getAllAreas = async (): Promise<AffectedAreaDTO[]> => {
    const areas = await areaRepo.getAllAreas();
    return areas.map((area) => {
        return {
            ...area,
            requiredResources: JSON.parse(area.requiredResources)
        }
    });
}

export const getAreaById = async (areaID: string): Promise<AffectedAreaDTO> => {
    const area = await areaRepo.getAreaByAreaID(areaID);
    if (!area) {
        throw areaError.AreaNotFoundError(`Area with areaID '${areaID}' is not found`);
    }
    return {
        ...area,
        requiredResources: JSON.parse(area.requiredResources)
    };
}

export const createAreas = async (areaData: AffectedAreaDTO[]) => {
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

    const error = existingAreas.length > 0 ?
        `${existingAreas.map(area => area.areaID).join(", ")} areas are already exist`
        : "No error found";

    return {
        message: `${createdAreas.count} areas created successfully`,
        error,
    }
}

export const updateArea = async (areaID: string, areaData: Partial<AffectedArea>) => {
    const existingArea = await getAreaById(areaID);
    if (!existingArea) {
        throw areaError.AreaNotFoundError(`Area with areaID '${areaID}' is not found`);
    }

    const updatedArea = await areaRepo.updateArea(areaID, areaData);
    return {
        ...updatedArea,
        requiredResources: JSON.parse(updatedArea.requiredResources)
    };
}