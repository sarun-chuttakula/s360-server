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
    message:string;
    missing:[]; //missingstudents
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