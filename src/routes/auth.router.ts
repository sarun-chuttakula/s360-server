import { NextFunction, Request, Response, Router } from "express";
import AuthController from "../controllers/auth.controller";
import { UnauthorizedException, catchAsync } from "../utils/error.util";
import httpStatus from "http-status";

const router = Router();

router.route("/register").post(
  catchAsync(async (req: Request, res: Response) => {
    const authController = new AuthController(req);
    const response = await authController.registerUser(req.body);
    res.status(httpStatus.CREATED).json(response);
  })
);
router.route("/login").post(
  catchAsync(async (req: Request, res: Response) => {
    const authController = new AuthController(req);
    const response = await authController.loginUser(req.body);
    res.status(httpStatus.OK).json(response);
  })
);

export default router;
