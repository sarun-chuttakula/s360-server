import express, { Request, Response } from "express";
import AuthRouter from "./auth.router";
import GroupRouter from "./group.router";
import AttendanceRouter from "./attendance.route"
import { catchAsync } from "../utils/error.util";
const router = express.Router();
router.get(
  "/",
  catchAsync(async (req: Request, res: Response) => {
    res.send("Hello, S360 is running!");
  })
);
router.use("/auth", AuthRouter);
router.use("/group", GroupRouter);
router.use("/attendance", AttendanceRouter)
export default router;
