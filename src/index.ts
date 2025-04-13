import express, { Response } from "express";
import areaRouter from "./routes/areaRoute";
import truckRouter from "./routes/truckRoute";
import assignmentRouter from "./routes/assignmentRoute";
import initializeRedisClient from "./db/redisClient";

const app = express();
app.use(express.json());
app.use("/api/areas", areaRouter);
app.use("/api/trucks", truckRouter);
app.use("/api/assignments", assignmentRouter);
app.use((_, res: Response) => {
  res.status(404).json("Request Not Found");
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const closeServer = async () => {
  try {
    server.close(() => console.log('Server closed.'));

    const redisClient = await initializeRedisClient();
    await redisClient.quit()
    console.log("Redis Client Disconnected");

    process.exit(0);
  } catch (err) {
    console.error('Error during close server:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', closeServer);
process.on('SIGINT', closeServer);

export default app;