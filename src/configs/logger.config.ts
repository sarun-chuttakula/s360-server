import * as winston from "winston";
import "winston-mongodb";
import { mongodbConfig, performanceMongodbConfig } from "./data-source";

export const loggerConfig: winston.LoggerOptions = {
  level: "http",
  format: winston.format.json(),
  transports: [
    process.env.NODE_ENV !== "development"
      ? new winston.transports.Console({
          format: winston.format.simple(),
        })
      : new winston.transports.MongoDB(mongodbConfig),
  ],
  defaultMeta: "",
};

export const performanceLoggerConfig: winston.LoggerOptions = {
  level: "http",
  format: winston.format.json(),
  transports: [
    process.env.NODE_ENV !== "development"
      ? new winston.transports.Console({
          format: winston.format.simple(),
        })
      : new winston.transports.MongoDB(performanceMongodbConfig),
  ],
  defaultMeta: "",
};
