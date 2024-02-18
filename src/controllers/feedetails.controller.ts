import { Body, Get, Post, Put, Query, Route, Tags } from "tsoa";
import { RESPONSE_MESSAGE, ERROR_MESSAGE } from "../constants";
import e, { Request } from "express";
import {
  AlreadyExistsError,
  ServerErrorException,
  UnauthorizedException,
} from "../utils/error.util";
import logger from "../utils/logger.util";
import {
  ApiResponse,
  IResponseDto,
  INewFeeDetailsRequest,
  INewFeeDetailsResponse,
  newFeeDetailsResponseFields,
} from "../dtos";
import mask from "../utils/mask.util";
import { createFeeDetails, getFeeDetails } from "../repositories";

@Route("feedetails")
@Tags("FeeDetails")
export default class FeeDetailsController {
  constructor(private req: Request) {}

  @Post("/")
  public async createFeeDetails(
    @Body() body: INewFeeDetailsRequest
  ): Promise<IResponseDto<INewFeeDetailsResponse>> {
    try {
      if (!this.req.user)
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const FeeDetails = await createFeeDetails(body, this.req.user);
      return new ApiResponse(
        true,
        mask(FeeDetails, newFeeDetailsResponseFields),
        RESPONSE_MESSAGE.FEEDETAILS_CREATE
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
  public async getFeeDetails(
    @Query() id?: string
  ): Promise<IResponseDto<INewFeeDetailsResponse>> {
    try {
      if (!(this.req.user || this.req.student))
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const user = this.req.user || this.req.student;
      if (!user)
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const feeDetails = await getFeeDetails(user, id);

      return new ApiResponse(
        true,
        mask(feeDetails, newFeeDetailsResponseFields),
        RESPONSE_MESSAGE.FEEDETAILS_FETCHED
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
