import { Role } from "../enums";

export interface IUserRegisterRequest {
  firstname: string;
  lastname: string;
  dob: string;
  gender: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  profile_pic: string;
  role: Role;
  class?: string;
  batch?: string;
}

export const UserRegisterResponseFields = {
  firstname: undefined,
  lastname: undefined,
  role: undefined,
  dob: undefined,
  gender: undefined,
  username: undefined,
  password: undefined,
  lastlogin: undefined,
  profile_pic: undefined,
  email: undefined,
  phone: undefined,
  batch: undefined,
  accesstoken: undefined,
  refreshtoken: undefined,
};

export interface IUserRegisterResponse {
  firstname: string;
  lastname: string;
  role: string;
  dob: string;
  gender: string;
  username: string;
  password: string;
  lastlogin: Date;
  profile_pic: string;
  email: string;
  phone: string;
  batch?: string;
}

export interface IUserUpdateRequest {
  firstname?: string;
  lastname?: string;
  role?: string;
  dob?: string;
  gender?: string;
  username?: string;
  password?: string;
  lastlogin?: Date;
  profile_pic?: string;
  email?: string;
  phone?: string;
  batch?: string;
}

export const UserUpdateResponseFields = {
  firstname: undefined,
  lastname: undefined,
  role: undefined,
  dob: undefined,
  gender: undefined,
  username: undefined,
  password: undefined,
  lastlogin: undefined,
  profile_pic: undefined,
  email: undefined,
  phone: undefined,
};

export interface IUserUpdateResponse {
  firstname: string;
  lastname: string;
  role: string;
  dob: string;
  gender: string;
  username: string;
  password: string;
  lastlogin: Date;
  profile_pic: string;
  email: string;
  phone: string;
}

export interface IUserLoginRequest {
  username: string;
  password: string;
}

export interface IUserLoginResponse {
  token: string;
}

export interface IUserForgotPasswordRequest {
  username: string;
}

export interface IUserForgotPasswordResponse {
  token: string;
}
