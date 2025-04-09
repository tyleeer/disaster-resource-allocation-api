import express, { Response } from "express";
import areaRouter from "./routes/areaRoute";
import truckRouter from "./routes/truckRoute";
import assignmentRouter from "./routes/assignmentRoute";

const app = express();

app.use(express.json());
const port = process.env.PORT || 3000;

app.use("/api/areas", areaRouter);
app.use("/api/trucks", truckRouter);
app.use("/api/assignments", assignmentRouter);

app.use((_, res: Response) => {
  res.status(404).json("Request Not Found");
});

app.listen(port, () => {
  console.log(`App listening at port: ${port}`);
});
