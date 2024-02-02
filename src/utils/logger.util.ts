import {
  loggerConfig,
  performanceLoggerConfig,
} from "../configs/logger.config";
import * as winston from "winston";

const loggerClient = winston.createLogger(loggerConfig);
const performanceLoggerClient = winston.createLogger(performanceLoggerConfig);

const logger = {
  info(message: string, origin = "server", meta?: object) {
    loggerClient.info(message, {
      details: {
        origin,
        ...meta,
      },
    });
  },
  error(message: string, origin = "server", meta?: object) {
    loggerClient.error(message, {
      details: {
        origin,
        ...meta,
      },
    });
  },
  warn(message: string, origin = "server", meta?: object) {
    loggerClient.warn(message, {
      details: {
        origin,
        ...meta,
      },
    });
  },
  http(message: string, origin = "server", meta?: object) {
    loggerClient.http(message, {
      details: {
        origin,
        ...meta,
      },
    });
  },
  exception(message: string, origin = "server", meta?: object) {
    loggerClient.http(message, {
      details: {
        origin,
        ...meta,
      },
    });
  },
  performance(message: string, meta?: object, origin = "server") {
    performanceLoggerClient.info(message, {
      details: {
        origin,
        ...meta,
      },
    });
  },
  query(options: any, callback: (err: any, result: any) => void) {
    performanceLoggerClient.query(options, callback);
  },
};

export default logger;
