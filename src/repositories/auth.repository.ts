import { IUserRegisterRequest, IUserRegisterResponse } from "../dtos";
import AppDataSource from "../configs/data-source";
import { User } from "../models";
import {
  AlreadyExistsError,
  NotFoundException,
  ServerErrorException,
  UnauthorizedException,
  compareHash,
  generateHash,
  generateToken,
  removeFromCache,
  storeUserTokenInCache,
  verifyToken,
} from "../utils";
import { ERROR_MESSAGE } from "../constants";
import { randomUUID } from "crypto";
import config from "../configs/auth.config";
import { Student } from "../models";
import { Role } from "../enums";
import { Classes } from "../models/class.model";
import { BatchFolder } from "../models/batch-folder.model";
import { createFolder } from "./library.repository";
const classRepository = AppDataSource.manager.getRepository(Classes);

export const register = async (payload: IUserRegisterRequest): Promise<any> => {
  // console.log(payload, "payload");
  const lowercaseUsername = payload.username.toLowerCase();
  const userRepository = AppDataSource.manager.getRepository(User);
  const studentRepository = AppDataSource.manager.getRepository(Student);
  if (payload.role === "student") {
    const existingStudent = await studentRepository.findOne({
      where: [{ email: payload.email }, { ht_no: lowercaseUsername }],
    });
    if (existingStudent) {
      throw new AlreadyExistsError("Student already exists");
    }

    const hashedPassword = await generateHash(payload.password);
    const myclass = await classRepository.findOne({
      where: { name: payload.class },
    });
    if (!myclass) throw new NotFoundException("Class not found");
    const batch = payload.batch || new Date().getFullYear();
    const newStudent = await studentRepository.save({
      ...new Student(),
      ...payload,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: "SELF",
      updated_by: "SELF",
      ht_no: lowercaseUsername,
      password: hashedPassword,
      class: myclass,
      batch: `${batch}`,
      // batchfolder: batch,
    });
    const tokenUuid = randomUUID();
    const refreshToken = generateToken(
      {
        id: newStudent.id,
        uuid: tokenUuid,
      },
      "refresh"
    );
    const accessToken = generateToken({
      id: newStudent.id,
      role: newStudent.role,
      uuid: tokenUuid,
    });
    storeUserTokenInCache(
      `${newStudent.id}-accessToken-${tokenUuid}`,
      accessToken,
      config.accessTokenExpiryTime
    );
    storeUserTokenInCache(
      `${newStudent.id}-refreshToken-${tokenUuid}`,
      refreshToken,
      config.refreshTokenExpiryTime
    );
    newStudent.password = "";
    return {
      ...newStudent,
      accesstoken: accessToken,
      refreshtoken: refreshToken,
    };
  }
  const existingUser = await userRepository.findOne({
    where: [{ email: payload.email }, { username: lowercaseUsername }],
  });
  const user = new User();
  if (existingUser) {
    throw new AlreadyExistsError("User already exists");
  }
  const hashedPassword = await generateHash(payload.password);
  const newuser = await userRepository.save({
    ...user,
    ...payload,
    created_at: new Date(),
    updated_at: new Date(),
    created_by: "SELF",
    updated_by: "SELF",
    username: lowercaseUsername,
    password: hashedPassword,
  });
  console.log(newuser);
  const tokenUuid = randomUUID();
  const refreshToken = generateToken(
    {
      id: newuser.id,
      uuid: tokenUuid,
    },
    "refresh"
  );
  console.log(newuser.role, "user.role");

  const accessToken = generateToken({
    id: newuser.id,
    role: newuser.role,
    uuid: tokenUuid,
  });

  storeUserTokenInCache(
    `${newuser.id}-accessToken-${tokenUuid}`,
    accessToken,
    config.accessTokenExpiryTime
  );

  storeUserTokenInCache(
    `${newuser.id}-refreshToken-${tokenUuid}`,
    refreshToken,
    config.refreshTokenExpiryTime
  );
  newuser.password = "";
  return {
    ...newuser,
    accesstoken: accessToken,
    refreshtoken: refreshToken,
  };
};

export const login = async (payload: IUserRegisterRequest): Promise<any> => {
  const userRepository = AppDataSource.getRepository(User);
  let whereConditions: any = [];
  if (payload.email) {
    whereConditions.push({ email: payload.email });
  }
  if (payload.username) {
    whereConditions.push({ username: payload.username });
  }
  const studentRepository = AppDataSource.manager.getRepository(Student);

  const lowercaseUsername = payload.username.toLowerCase();

  const existingStudent = await studentRepository.findOne({
    where: {
      ht_no: lowercaseUsername,
    },
    relations: ["class"],
  });
  if (existingStudent) {
    if (!(await compareHash(payload.password, existingStudent.password))) {
      throw new UnauthorizedException(ERROR_MESSAGE.INVALID_CREDENTIALS);
    }
    const tokenUuid = randomUUID();
    const refreshToken = generateToken(
      {
        id: existingStudent.id,
        uuid: tokenUuid,
      },
      "refresh"
    );

    const accessToken = generateToken({
      id: existingStudent.id,
      role: existingStudent.role,
      uuid: tokenUuid,
    });

    storeUserTokenInCache(
      `${existingStudent.id}-accessToken-${tokenUuid}`,
      accessToken,
      config.accessTokenExpiryTime
    );

    storeUserTokenInCache(
      `${existingStudent.id}-refreshToken-${tokenUuid}`,
      refreshToken,
      config.refreshTokenExpiryTime
    );
    existingStudent.password = "";
    return {
      ...existingStudent,
      class: existingStudent.class.id,
      accesstoken: accessToken,
      refreshtoken: refreshToken,
    };
  }
  const user = await userRepository.findOne({
    where: whereConditions,
  });
  if (!user) {
    throw new NotFoundException("User not found");
  }
  if (user.is_active === false && user.is_deleted === true) {
    throw new Error("User is not active");
  }
  if (!(await compareHash(payload.password, user.password))) {
    throw new UnauthorizedException(ERROR_MESSAGE.INVALID_CREDENTIALS);
  }
  console.log(user, "user");
  const tokenUuid = randomUUID();
  const refreshToken = generateToken(
    {
      id: user.id,
      uuid: tokenUuid,
    },
    "refresh"
  );

  const accessToken = generateToken({
    id: user.id,
    role: user.role,
    uuid: tokenUuid,
  });

  storeUserTokenInCache(
    `${user.id}-accessToken-${tokenUuid}`,
    accessToken,
    config.accessTokenExpiryTime
  );

  storeUserTokenInCache(
    `${user.id}-refreshToken-${tokenUuid}`,
    refreshToken,
    config.refreshTokenExpiryTime
  );
  user.password = "";
  return {
    ...user,
    accesstoken: accessToken,
    refreshtoken: refreshToken,
  };
};

export const logout = async (tokenString: string, user: User) => {
  const token = tokenString?.split(" ")[1];
  if (!token) {
    throw new ServerErrorException();
  }
  if (token && user.id) {
    const tokenResult = verifyToken(token);
    if (tokenResult.result) {
      await removeFromCache(
        `${user.id}-accessToken-${tokenResult.payload.uuid}`
      );
      await removeFromCache(
        `${user.id}-refreshToken-${tokenResult.payload.uuid}`
      );
    }
  }
  return;
};
