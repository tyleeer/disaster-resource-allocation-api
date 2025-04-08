import express, { Request, Response } from "express";
import areaRouter from "./routes/areaRoute";
import truckRouter from "./routes/truckRoute";

const app = express();

app.use(express.json());
const port = process.env.PORT || 3000;

app.use("/api/areas", areaRouter);
app.use("/api/trucks", truckRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
