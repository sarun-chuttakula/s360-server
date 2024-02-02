import { redisClient, redisConfig } from "../configs";
import logger from "./logger.util";

export const getFromCache = async (key: string) => {
  try {
    const value = await redisClient.get(key);
    if (value) return JSON.parse(value);
    return null;
  } catch (error) {
    return null;
  }
};

export const storeIntoCache = async (
  key: string,
  value: any,
  expiresAt = Number(redisConfig.expiresAt)
) => {
  try {
    const valueString = JSON.stringify(value);
    await redisClient.set(key, valueString, { EX: expiresAt });
  } catch (error) {
    logger.exception("Error storing into redis cache", String(error));
  }
};

export const removeFromCache = async (key: string) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.exception("Error removing from redis cache", String(error));
  }
};

export const flushCache = async () => {
  try {
    const response = await redisClient.flushAll();
    return response;
  } catch (error) {
    logger.exception("Error flushing redis cache", String(error));
    return String(error);
  }
};
