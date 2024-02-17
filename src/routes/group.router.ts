import { Router, Response, Request } from "express";
import { authorizeUser } from "../middlewares";
import { catchAsync } from "../utils";
import httpStatus from "http-status";
import authController from "../controllers/auth.controller";
import GroupController from "../controllers/group.controller";
import { Role } from "../enums";

const router = Router();
router
  .route("/")
  .post(
    authorizeUser([Role.teacher]),
    catchAsync(async (req: Request, res: Response) => {
      const groupController = new GroupController(req);
      const response = await groupController.createGroup(req.body);
      res.status(httpStatus.CREATED).json(response);
    })
  )
  .get(
    authorizeUser([Role.teacher, Role.student]),
    catchAsync(async (req: Request, res: Response) => {
      const groupController = new GroupController(req);
      const response = await groupController.getAllGroups();
      res.status(httpStatus.OK).json(response);
    })
  )
  // .put(
  //   authorizeUser([Role.teacher]),
  //   catchAsync(async (req: Request, res: Response) => {
  //     const groupController = new GroupController(req);
  //     const response = await groupController.updateGroup(req.body);
  //     res.status(httpStatus.OK).json(response);
  //   })
  // )
  .delete(
    authorizeUser([Role.teacher]),
    catchAsync(async (req: Request, res: Response) => {
      const groupController = new GroupController(req);
      const response = await groupController.deleteGroup(
        req.query.groupId as string
      );
      res.status(httpStatus.OK).json(response);
    })
  );

export default router;
