import { Router, Response, Request } from "express";
import { authorizeUser } from "../middlewares";
import { catchAsync } from "../utils";
import httpStatus from "http-status";
import MessageController from "../controllers/message.controller";
import { Role } from "../enums";

const router = Router();
router.route("/").post(
  authorizeUser([Role.teacher, Role.student]),
  catchAsync(async (req: Request, res: Response) => {
    const messageController = new MessageController(req);
    const response = await messageController.sendMessage(req.body);
    res.status(httpStatus.CREATED).json(response);
  })
);
// .get(
//   authorizeUser([Role.teacher]),
//   catchAsync(async (req: Request, res: Response) => {
//     const messageController = new MessageController(req);
//     const response = await messageController.getMessages();
//     res.status(httpStatus.OK).json(response);
//   })
// );

router.route("/").get(
  authorizeUser([Role.teacher, Role.student]),
  catchAsync(async (req: Request, res: Response) => {
    const messageController = new MessageController(req);
    const response = await messageController.getMessagesByGroup(
      req.query.groupId as string,
      req.query.page as string
    );
    res.status(httpStatus.OK).json(response);
  })
);

export default router;
