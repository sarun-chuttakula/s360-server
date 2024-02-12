import { Body, Post, Put, Route, Tags } from "tsoa";
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
import { INewAttendanceRequest, INewAttendanceResponse, newAttendanceResponseFields } from "../dtos";
import { createAttendance, updateAttendance } from "../repositories";

@Route("attendance")
@Tags("Attendance")
export default class AttendanceController {
    constructor(private req: Request) { }

    @Post("/")
    public async createAttendance(
        @Body() body: INewAttendanceRequest[]
    ): Promise<IResponseDto<INewAttendanceResponse>> {
        try {
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
}
