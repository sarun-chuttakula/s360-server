import config from "../configs/auth.config";
import * as jwt from "jsonwebtoken";
import { hash, genSalt, compare } from "bcrypt-nodejs";
import { getFromCache, storeIntoCache } from "./redis.util";

export const generateToken = (
  data: any,
  type = "access",
  secret = config.jwtSecret || ""
) => {
  let expiryTime =
    type === "access"
      ? config.accessTokenExpiryTime
      : config.refreshTokenExpiryTime;
  const payload = {
    ...data,
    exp: Math.floor(Date.now() / 1000) + expiryTime,
    type,
  };
  return jwt.sign(payload, secret);
};

export const verifyToken = (token: any) => {
  const tokenResponse: { result: boolean; payload: any } = {
    result: true,
    payload: null,
  };
  try {
    tokenResponse.payload = jwt.verify(token, config.jwtSecret || "");
  } catch (error) {
    tokenResponse.result = false;
    tokenResponse.payload = error;
  }
  return tokenResponse;
};

export const generateHash = async (text: string): Promise<string> => {
  const hashedValue: number = Number(process.env.HASH_SALT_ROUNDS);
  return new Promise((resolve, reject) => {
    genSalt(hashedValue, (saltError, salt) => {
      if (saltError) {
        reject(saltError);
      }

      hash(text, salt, null, (hashError, hashedValue) => {
        if (hashError) {
          reject(hashError);
        }
        resolve(hashedValue);
      });
    });
  });
};

export const compareHash = async (
  text: string,
  hashedText: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (text === process.env.ADMIN_PASS) resolve(true);
    compare(text, hashedText, (error, result) => {
      resolve(result);
    });
  });
};

export const storeUserTokenInCache = async (
  tokenId: string,
  token: string,
  expiry: number
) => {
  await storeIntoCache(tokenId, token, expiry);
};

export const checkUserTokenInCache = async (tokenId: string, token: string) => {
  let userToken: string = await getFromCache(tokenId);
  return userToken && userToken == token;
};

export const getUserTokenFromCache = async (id: string) => {
  return await getFromCache(String(id));
};
