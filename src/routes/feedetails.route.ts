import { Router, Response, Request } from "express";
import { authorizeUser } from "../middlewares";
import { catchAsync } from "../utils";
import httpStatus from "http-status";
import { Role } from "../enums";
import FeeDetailsController from "../controllers/feedetails.controller";

const router = Router();
router.route("/").post(
  authorizeUser([Role.teacher, Role.admin, Role.student]),
  catchAsync(async (req: Request, res: Response) => {
    const feedetails = new FeeDetailsController(req);
    const response = await feedetails.createFeeDetails(req.body);
    res.status(httpStatus.CREATED).json(response);
  })
);

router.route("/").get(
  authorizeUser([Role.teacher, Role.admin, Role.student]),
  catchAsync(async (req: Request, res: Response) => {
    const feedetails = new FeeDetailsController(req);
    const response = await feedetails.getFeeDetails(req.query.id as string);
    res.status(httpStatus.OK).json(response);
  })
);

export default router;
