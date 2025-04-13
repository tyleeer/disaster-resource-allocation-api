import type { RedisClientType } from "redis";
import { CachedAssignments, ProcessedAssignment } from "../models";

export const getCachedAssignments = async (client: RedisClientType, key: string): Promise<CachedAssignments> => {
    try {
        const data = await client.hGetAll(key);
        if (!data || Object.keys(data).length === 0) {
            return { hasCacheData: false, assignments: [] };
        }
        const assignments = JSON.parse(data.assigments) as ProcessedAssignment[];
        const hasCacheData = Array.isArray(assignments) && assignments.length !== 0;
        return { hasCacheData, assignments };
    } catch (error) {
        console.error("Error getting cached assignments:", error);
        throw new Error("Failed to get cached assignments");
    }
}

export const setCacheTTL = async (client: RedisClientType, key: string) => {
    try {
        const ttl = process.env.ASSIGNMENT_TTL as string;
        console.log(`set cache data ttl to ${ttl}`);
        if (!ttl) {
            throw new Error("REDIS_TTL is not defined in .env file");
        }
        await client.expire(key, parseInt(ttl));
    } catch (error) {
        console.error("Error setting cache TTL:", error);
        throw new Error("Failed to set cache TTL");
    }
}

export const setCachedAssignment = async (client: RedisClientType, key: string, assigments: ProcessedAssignment[]) => {
    try {
        const data = { assigments: JSON.stringify(assigments) };
        await client.hSet(key, data);
        console.log({ message: "store cache data success: " }, assigments);
        await setCacheTTL(client, key);
    } catch (error) {
        console.error("Error setting cached assignment:", error);
        throw new Error("Failed to set cached assignment");
    }
}

export const deleteCachedAssignment = async (client: RedisClientType, key: string) => {
    try {
        await client.del(key);
        console.log("delete cache data success");
    } catch (error) {
        console.error("Error deleting cached assignment:", error);
        throw new Error("Failed to delete cached assignment");
    }
}