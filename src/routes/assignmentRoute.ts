import { Router } from "express";
import { getLastProcessedAssignments } from "../services/assignmentService";

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
    }
});

export default assignmentRouter;