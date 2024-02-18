import { AttendanceEnum } from "enums";

export interface INewAttendanceRequest {
  attendance: AttendanceEnum;
  ht_no: string;
}

export const newAttendanceResponseFields = {
  message: undefined,
  missing: undefined, //missingstudents
};

export interface INewAttendanceResponse {
  message: string;
  missing: []; //missingstudents
}

export interface IAttendanceUpdateRequest {
  ht_no: string;
  attendance: AttendanceEnum;
}

export const AttendanceUpdateResponseFields = {
  message: undefined,
};

export interface IAttendanceUpdateResponse {
  message: string;
}

export const getAllStudentsResponseFields = {
  id: undefined,
  email: undefined,
  phone: undefined,
  firstname: undefined,
  lastname: undefined,
  dob: undefined,
  gender: undefined,
  ht_no: undefined,
  lastlogin: undefined,
  profile_pic: undefined,
};
export interface IGetAllStudentsResponse {
  id: string;
  email: string;
  phone: string;
  firstname: string;
  lastname: string;
  dob: string;
  gender: string;
  ht_no: string;
  lastlogin: Date;
  profile_pic: string;
}
