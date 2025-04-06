
import express, { Request, Response } from "express";

const app = express();

app.use(express.json());
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
