import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.util";

/**
 *
 * @param req Request
 * @param res Response
 * @param next
 */
const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const metaData = {
    queryParams: req.query,
    requestParams: req.params,
    body: req.body,
    method: req.method,
    apiUrl: req.url,
    headers: req.headers,
  };

  logger.http(req.url, "http", metaData);
  next();
};

export default loggerMiddleware;
