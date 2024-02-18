import { Router, Response, Request } from "express";
import { authorizeUser } from "../middlewares";
import { catchAsync } from "../utils";
import httpStatus from "http-status";
import { Role } from "../enums";
import ClassesController from "../controllers/classes.controller";

const router = Router();
router
  .route("/")
  .post(
    authorizeUser([Role.teacher]),
    catchAsync(async (req: Request, res: Response) => {
      const classesController = new ClassesController(req);
      const response = await classesController.createClass(req.body);
      res.status(httpStatus.CREATED).json(response);
    })
  )
  .get(
    authorizeUser([Role.teacher, Role.admin, Role.student]),
    catchAsync(async (req: Request, res: Response) => {
      const classesController = new ClassesController(req);
      const response = await classesController.getAllClasses(
        req.query.id as string
      );
      res.status(httpStatus.OK).json(response);
    })
  );

router.route("/students").get(
  authorizeUser([Role.teacher, Role.admin, Role.student]),
  catchAsync(async (req: Request, res: Response) => {
    const classesController = new ClassesController(req);
    const response = await classesController.getAllStudentsbyClass(
      req.query.classId as string
    );
    res.status(httpStatus.OK).json(response);
  })
);

router.route("/timetable").get(
  authorizeUser([Role.teacher, Role.admin, Role.student]),
  catchAsync(async (req: Request, res: Response) => {
    const classesController = new ClassesController(req);
    const response = await classesController.getTimetable(
      req.query.classId as string
    );
    res.status(httpStatus.OK).json(response);
  })
);
export default router;
