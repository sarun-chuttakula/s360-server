import { Router, Response, Request } from "express";
import { authorizeUser } from "../middlewares";
import { catchAsync } from "../utils";
import httpStatus from "http-status";
import authController from "../controllers/auth.controller";
import GroupController from "../controllers/group.controller";
import { Role } from "../enums";

const router = Router();
router.route("/").post(
  authorizeUser([Role.teacher]),
  catchAsync(async (req: Request, res: Response) => {
    const groupController = new GroupController(req);
    const response = await groupController.createGroup(req.body);
    res.status(httpStatus.CREATED).json(response);
  })
);

export default router;
