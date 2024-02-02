import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ERROR_MESSAGE, TYPE_ORM_ERROR_CODE } from "../constants";
import { ErrorResponse } from "../dtos";
import {
  ApiError,
  ForbiddenAccessException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/error.util";
import { QueryFailedError } from "typeorm";
import logger from "../utils/logger.util";

/**
 *
 * @param error any
 * @param req Request
 * @param res Response
 * @param next
 */
export const errorLogger = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    !(error instanceof UnauthorizedException) &&
    !(error instanceof ForbiddenAccessException) &&
    !(error instanceof NotFoundException)
  )
    logger.error(error.message, "server", error);
  next(error);
};

/**
 *
 * @param error any
 * @param req Request
 * @param res Response
 * @param next
 */
export const failSafeHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorMessage = error.message || ERROR_MESSAGE.SERVER_ERROR;
  res
    .status(error.statusCode)
    .send(new ErrorResponse(false, null, errorMessage, error.stack));
};

/**
 *
 * @param error any
 * @param res Response
 */
export const handleTypeOrmError = (error: any, res: Response) => {
  switch (error.code) {
    case TYPE_ORM_ERROR_CODE.ER_DUP_ENTRY:
      res
        .status(httpStatus.BAD_REQUEST)
        .send(new ErrorResponse(false, null, (error as any).sqlMessage));
      break;
    default:
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send(new ErrorResponse(false, null, (error as any).sqlMessage));
  }
};

/**
 *
 * @param error any
 * @param req Request
 * @param res Response
 * @param next
 */
export const errorResponder = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (typeof error === "string") next(new ApiError(400, String(error)));
  else if (error.name == "redirect") res.redirect("/error");
  else if (error.name == "time-out") next(new ApiError(408, error.message));
  else if (error instanceof QueryFailedError)
    return handleTypeOrmError(error, res);
  else if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message ?? ERROR_MESSAGE.SERVER_ERROR;
    next(new ApiError(statusCode, message));
  } else {
    next(error);
  } // forwarding exceptional case to fail-safe middleware
};
