import { Router, Response, Request } from "express";
import { authorizeUser } from "../middlewares";
import { catchAsync } from "../utils";
import httpStatus from "http-status";
import FeedbackController from "../controllers/feedback.controller";
import { Role } from "../enums";

const router = Router();
router.route("/").post(
  authorizeUser([Role.student]),
  catchAsync(async (req: Request, res: Response) => {
    const feedbackController = new FeedbackController(req);
    const response = await feedbackController.createFeedback(req.body);
    res.status(httpStatus.CREATED).json(response);
  })
);

export default router;
