import { Router } from "express";
import { getAllAreas, getAreaById, createAreas } from "../services/areaService";
import { AffectedAreaForCreate } from "../models";

const areaRouter = Router();

areaRouter.get("/", async (req, res) => {
    try {
        const areas = await getAllAreas();
        res.status(200).json(areas);
    } catch (error) {
        console.error("Error fetching areas:", error);
        res.status(500).json({ error: "Failed to request areas" });
    }
});

areaRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const area = await getAreaById(id);
        if (area) {
            res.status(200).json(area);
        } else {
            res.status(404).json({ error: "Area not found" });
        }
    } catch (error) {
        console.error("Error fetching areas:", error);
        res.status(500).json({ error: "Failed to request a area" });
    }
});

areaRouter.post("/", async (req, res) => {
    try {
        const areaData = req.body as AffectedAreaForCreate[];
        if (!Array.isArray(areaData) || areaData.length === 0) {
            res.status(400).json({ error: "Invalid area data" });
            return;
        }
        const newArea = await createAreas(areaData);
        res.status(201).json(newArea);
    } catch (error) {
        const errorInfo = error as Error;
        console.error("Error fetching areas:", errorInfo);
        res.status(500).json({
            name: errorInfo.name,
            message: errorInfo.message
        });
    }
});

export default areaRouter;