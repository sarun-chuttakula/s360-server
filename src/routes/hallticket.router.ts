import { Router, Response, Request } from "express";
import { authorizeUser } from "../middlewares";
import { catchAsync } from "../utils";
import httpStatus from "http-status";
import { Role } from "../enums";
import HallTicketController from "../controllers/hallticket.controller";

const router = Router();
router.route("/").get(
  authorizeUser([Role.student]),
  catchAsync(async (req: Request, res: Response) => {
    const hallticket = new HallTicketController(req);
    const response = await hallticket.getHallticket();
    res.status(httpStatus.CREATED).json(response);
  })
);
router.route("/result").get(
  authorizeUser([Role.student, Role.admin,Role.teacher]),
  catchAsync(async (req: Request, res: Response) => {
    const hallticket = new HallTicketController(req);
    const response = await hallticket.getResultbyHallticket(
      req.query.semester as string,
      req.query.ht_no as string,
    );
    res.status(httpStatus.CREATED).json(response);
  })
);

export default router;
