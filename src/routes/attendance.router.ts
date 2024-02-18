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

router.route("/students").get(
  authorizeUser([Role.teacher]),
  catchAsync(async (req: Request, res: Response) => {
    const attendanceController = new AttendanceController(req);
    const response = await attendanceController.getAllStudents();
    res.status(httpStatus.OK).json(response);
  })
);

router.route("/").get(
  authorizeUser([Role.teacher]),
  catchAsync(async (req: Request, res: Response) => {
    const attendanceController = new AttendanceController(req);
    const response = await attendanceController.attendanceGraph(
      req.query.studentId as string,
      req.query.aggregator as string,
      req.query.startDate as string,
      req.query.endDate as string
    );
    res.status(httpStatus.OK).json(response);
  })
);
export default router;
