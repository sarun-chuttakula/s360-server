import { Router, Response, Request } from "express";
import { authorizeUser } from "../middlewares";
import { catchAsync } from "../utils";
import httpStatus from "http-status";
import { Role } from "../enums";
import AttendanceController from "../controllers/attendance.controller";

const router = Router();
router.route("/").post(
  authorizeUser([Role.teacher]),
  catchAsync(async (req: Request, res: Response) => {
    const attendanceController = new AttendanceController(req);
    const response = await attendanceController.createAttendance(req.body);
    res.status(httpStatus.CREATED).json(response);
  })
);

router.route("/update").put(
  authorizeUser([Role.teacher]),
  catchAsync(async (req: Request, res: Response) => {
    const attendanceController = new AttendanceController(req);
    const response = await attendanceController.updateAttendance(req.body);
    res.status(httpStatus.CREATED).json(response);
  })
);

export default router;
