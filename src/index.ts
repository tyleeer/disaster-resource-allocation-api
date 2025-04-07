import express, { Request, Response } from "express";
import areaRouter from "./routes/areaRoute";

const app = express();

app.use(express.json());
const port = process.env.PORT || 3000;

app.use("/api/areas", areaRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
