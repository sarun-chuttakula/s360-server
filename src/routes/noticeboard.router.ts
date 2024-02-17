import { Router, Response, Request } from "express";
import { authorizeUser } from "../middlewares";
import { catchAsync } from "../utils";
import httpStatus from "http-status";
import authController from "../controllers/auth.controller";
import GroupController from "../controllers/group.controller";
import { Role } from "../enums";
import NoticeboardController from "../controllers/noticeboard.controller";

const router = Router();
router
  .route("/")
  .post(
    authorizeUser([Role.teacher, Role.admin]),
    catchAsync(async (req: Request, res: Response) => {
      const noticeboardController = new NoticeboardController(req);
      const response = await noticeboardController.createNotice(req.body);
      res.status(httpStatus.CREATED).json(response);
    })
  )
  .get(
    authorizeUser([Role.teacher, Role.student]),
    catchAsync(async (req: Request, res: Response) => {
      const noticeboardController = new NoticeboardController(req);
      const response = await noticeboardController.getAllNotices();
      res.status(httpStatus.OK).json(response);
    })
  )
  .delete(
    authorizeUser([Role.teacher, Role.admin]),
    catchAsync(async (req: Request, res: Response) => {
      const noticeboardController = new NoticeboardController(req);
      const response = await noticeboardController.deleteNotice(
        req.query.noticeId as string
      );
      res.status(httpStatus.OK).json(response);
    })
  );

export default router;
