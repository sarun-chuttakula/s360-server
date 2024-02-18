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
  IClassesRequest,
  IClassesResponse,
  IGetAllClassesResponse,
  IGetAllStudentsResponse,
  classesResponseFields,
  getAllStudentsResponseFields,
} from "../dtos";
import {
  attendanceGraph,
  createAttendance,
  getAllStudents,
  updateAttendance,
} from "../repositories";
import { Student } from "../models";
import {
  createClass,
  getAllClasses,
  getAllStudentsbyClass,
  getTimetable,
} from "../repositories/classes.repository";
import { time } from "console";

@Route("classes")
@Tags("Classes")
export default class ClassesController {
  constructor(private req: Request) {}

  @Post("/")
  public async createClass(
    @Body() body: IClassesRequest
  ): Promise<IResponseDto<IClassesResponse>> {
    try {
      if (!this.req.user)
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const classes = await createClass(body, this.req.user);
      return new ApiResponse(
        true,
        mask(classes, classesResponseFields),
        RESPONSE_MESSAGE.CLASSES_CREATE
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
  public async getAllClasses(
    @Query() id?: string
  ): Promise<IResponseDto<IGetAllClassesResponse>> {
    try {
      if (!(this.req.user || this.req.student))
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const user = this.req.user || this.req.student;
      if (!user)
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const classes = await getAllClasses(user, id as string);

      return new ApiResponse(
        true,
        mask(classes, classesResponseFields),
        RESPONSE_MESSAGE.CLASSES_GET
      );
    } catch (error: any) {
      logger.error(error);
      throw new ServerErrorException(error.message);
    }
  }

  @Get("/students")
  public async getAllStudentsbyClass(
    @Query() classid: string
  ): Promise<IResponseDto<IGetAllStudentsResponse[]>> {
    try {
      if (!(this.req.user || this.req.student))
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const user = this.req.user || this.req.student;
      if (!user)
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const classes = await getAllStudentsbyClass(user, classid as string);

      return new ApiResponse(
        true,
        mask(classes, getAllStudentsResponseFields),
        RESPONSE_MESSAGE.CLASSES_GET
      );
    } catch (error: any) {
      logger.error(error);
      throw new ServerErrorException(error.message);
    }
  }

  @Get("/timetable")
  public async getTimetable(@Query() classId: string): Promise<any> {
    try {
      if (!(this.req.user || this.req.student))
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const user = this.req.user || this.req.student;
      if (!user)
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const classes = await getTimetable(user, classId as string);
      console.log(classes);

      return new ApiResponse(true, classes, RESPONSE_MESSAGE.CLASSES_GET);
    } catch (error: any) {
      logger.error(error);
      throw new ServerErrorException(error.message);
    }
  }
}
