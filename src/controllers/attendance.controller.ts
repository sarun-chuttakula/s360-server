import { Body, Get, Post, Put, Query, Route, Tags } from "tsoa";
import { RESPONSE_MESSAGE, ERROR_MESSAGE } from "../constants";
import e, { Request } from "express";
import {
  AlreadyExistsError,
  ServerErrorException,
  UnauthorizedException,
} from "../utils/error.util";
import logger from "../utils/logger.util";
import { ApiResponse, IResponseDto } from "../dtos/response.dto";
import mask from "../utils/mask.util";
import {
  IGetAllStudentsResponse,
  INewAttendanceRequest,
  INewAttendanceResponse,
  getAllStudentsResponseFields,
  newAttendanceResponseFields,
} from "../dtos";
import {
  attendanceGraph,
  createAttendance,
  getAllStudents,
  updateAttendance,
} from "../repositories";
import { Student } from "../models";

@Route("attendance")
@Tags("Attendance")
export default class AttendanceController {
  constructor(private req: Request) {}

  @Post("/")
  public async createAttendance(
    @Body() body: INewAttendanceRequest[]
  ): Promise<IResponseDto<INewAttendanceResponse>> {
    try {
      console.log(body);
      console.log(body, "body");
      if (!this.req.user)
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const attendance = await createAttendance(body, this.req.user);
      return new ApiResponse(
        true,
        mask(attendance, newAttendanceResponseFields),
        RESPONSE_MESSAGE.ATTENDANCE_CREATE
      );
    } catch (error: any) {
      logger.error(error);
      if (error.statusCode === 409) {
        throw new AlreadyExistsError(error.message);
      } else {
        throw new ServerErrorException(error.message);
      }
    }
  }

  @Put("/update")
  public async updateAttendance(
    @Body() body: INewAttendanceRequest[]
  ): Promise<IResponseDto<INewAttendanceResponse>> {
    try {
      if (!this.req.user)
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const attendance = await updateAttendance(body, this.req.user);
      return new ApiResponse(
        true,
        mask(attendance, newAttendanceResponseFields),
        RESPONSE_MESSAGE.ATTENDANCE_UPDATE
      );
    } catch (error: any) {
      logger.error(error);
      if (error.statusCode === 409) {
        throw new AlreadyExistsError(error.message);
      } else {
        throw new ServerErrorException(error.message);
      }
    }
  }

  @Get("/students")
  public async getAllStudents(): Promise<
    IResponseDto<IGetAllStudentsResponse[]>
  > {
    try {
      if (!this.req.user)
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const attendance = await getAllStudents(this.req.user);
      return new ApiResponse(
        true,
        mask(attendance, getAllStudentsResponseFields),
        RESPONSE_MESSAGE.STUDENT_FETCHED
      );
    } catch (error: any) {
      logger.error(error);
      if (error.statusCode === 409) {
        throw new AlreadyExistsError(error.message);
      } else {
        throw new ServerErrorException(error.message);
      }
    }
  }

  @Get("/")
  public async attendanceGraph(
    @Query() studentId: string,
    @Query() aggregator: string,
    @Query() startDate: string,
    @Query() endDate?: string
  ): Promise<any> {
    try {
      if (!this.req.user)
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const attendance = await attendanceGraph(
        studentId,
        aggregator,
        startDate,
        endDate
      );
      return new ApiResponse(
        true,
        attendance,
        RESPONSE_MESSAGE.STUDENT_FETCHED
      );
    } catch (error: any) {
      logger.error(error);
      if (error.statusCode === 409) {
        throw new AlreadyExistsError(error.message);
      } else {
        throw new ServerErrorException(error.message);
      }
    }
  }
}
