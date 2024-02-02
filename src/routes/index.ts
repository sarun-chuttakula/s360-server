import express, { Request, Response } from "express";
import AuthRouter from "./auth.router";
import { catchAsync } from "../utils/error.util";
const router = express.Router();
router.get(
  "/",
  catchAsync(async (req: Request, res: Response) => {
    res.send("Hello, S360 is running!");
  })
);
router.use("/auth", AuthRouter);
export default router;
