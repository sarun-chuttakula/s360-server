import { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGE } from "../constants";
import httpStatus from "http-status";

export class ApiError extends Error {
  constructor(public statusCode: number, message?: string, stack = "") {
    super(message);

    if (process.env.NODE_ENV === "development") {
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
}

export class UnauthorizedException extends ApiError {
  constructor(message?: string) {
    super(
      httpStatus.UNAUTHORIZED,
      message ?? ERROR_MESSAGE.UNAUTHORIZED_ACCESS
    );
  }
}
export class ForbiddenAccessException extends ApiError {
  constructor(message?: string) {
    super(httpStatus.FORBIDDEN, message ?? ERROR_MESSAGE.FORBIDDEN_ACCESS);
  }
}
export class BadRequestException extends ApiError {
  constructor(message?: string) {
    super(httpStatus.BAD_REQUEST, message ?? ERROR_MESSAGE.BAD_REQUEST);
  }
}
export class NotFoundException extends ApiError {
  constructor(message?: string) {
    super(httpStatus.NOT_FOUND, message ?? ERROR_MESSAGE.NOT_FOUND);
  }
}
export class ServerErrorException extends ApiError {
  constructor(message?: string) {
    super(
      httpStatus.INTERNAL_SERVER_ERROR,
      message ?? ERROR_MESSAGE.SERVER_ERROR
    );
  }
}

export const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.log(err);
      next(err);
    });
  };

export class MaxAssignmentsReachedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MaxAssignmentsReachedError";
  }
}

export class AlreadyExistsError extends ApiError {
  constructor(message?: string) {
    super(httpStatus.CONFLICT, message ?? ERROR_MESSAGE.ALREADY_EXISTS);
    this.name = "AlreadyExistsError";
  }
}
