import { Router } from "express";
import { getAllTrucks, getTruckById, createTrucks } from "../services/truckService";
import { TruckDTO } from "../models";

const truckRouter = Router();

truckRouter.get("/", async (req, res) => {
    try {
        const trucks = await getAllTrucks();
        res.status(200).json(trucks);
    } catch (error) {
        console.error("Error fetching trucks:", error);
        const errorInfo = error as Error;
        if (errorInfo.name === "TruckNotFoundError") {
            res.status(404).json({
                name: errorInfo.name,
                message: errorInfo.message
            });
            return;
        }
        res.status(500).json({ error: "Failed to request trucks" });
    }
});

truckRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const truck = await getTruckById(id);
        res.status(200).json(truck);
    } catch (error) {
        console.error("Error fetching truck:", error);
        const errorInfo = error as Error;
        if (errorInfo.name === "TruckNotFoundError") {
            res.status(404).json({
                name: errorInfo.name,
                message: errorInfo.message
            });
            return;
        }
        res.status(500).json({ error: "Failed to request a truck" });
    }
});

truckRouter.post("/", async (req, res) => {
    try {
        const truckData = req.body as TruckDTO[];
        if (!Array.isArray(truckData) || truckData.length === 0) {
            res.status(400).json({ error: "Invalid truck data" });
            return;
        }
        const newTruck = await createTrucks(truckData);
        res.status(201).json(newTruck);
    } catch (error) {
        const errorInfo = error as Error;
        console.error("Error fetching trucks:", errorInfo);
        if (errorInfo.name === "TruckAlreadyExistsError") {
            res.status(400).json({
                name: errorInfo.name,
                message: errorInfo.message
            });
            return;
        }

        res.status(500).json({ error: "Failed to create trucks" });
    }
});

export default truckRouter;