import { createClient } from "redis";

export const redisConfig = {
  expiresAt: process.env.REDIS_EXPIRY_TIME,
  redisURL: process.env.REDIS_URL,
  redisPort: process.env.REDIS_PORT,
  timeout: 3000,
};

export const redisClient = createClient({ url: redisConfig.redisURL });
redisClient.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
  await redisClient.connect();
})();
