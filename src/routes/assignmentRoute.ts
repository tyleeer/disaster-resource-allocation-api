import { Router } from "express";
import { getLastProcessedAssignments, processAssignments } from "../services/assignmentService";

const assignmentRouter = Router();

assignmentRouter.get("/", async (req, res) => {
    try {
        const lastProcessedAssignments = await getLastProcessedAssignments();
        res.status(200).json(lastProcessedAssignments);
    } catch (error) {
        console.error("Error fetching last processed assignments:", error);
        res.status(500).json({ error: "Failed to request last processed assignments" });
    }
});

assignmentRouter.post("/", async (req, res) => {
    try {
        const assignments = await processAssignments();
        res.status(201).json(assignments);
    } catch (error) {
        const errorInfo = error as Error;
        console.error("Error fetching areas:", errorInfo);
        if (errorInfo.name === "AreaOrTruckNotFoundError") {
            res.status(400).json({
                name: errorInfo.name,
                message: errorInfo.message
            });
            return;
        }

        res.status(500).json({ error: "Failed to process assignments" });
    }
});

export default assignmentRouter;