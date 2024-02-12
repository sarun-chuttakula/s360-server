import { Body, Post, Put, Route, Tags } from "tsoa";
import { RESPONSE_MESSAGE, ERROR_MESSAGE } from "../constants";
import e, { Request } from "express";
import {
  AlreadyExistsError,
  ServerErrorException,
  UnauthorizedException,
} from "../utils/error.util";
import logger from "../utils/logger.util";
import { ApiResponse, IResponseDto, INewFeeDetailsRequest, INewFeeDetailsResponse, newFeeDetailsResponseFields } from "../dtos";
import mask from "../utils/mask.util";
import { createFeeDetails } from "../repositories";

@Route("feedetails")
@Tags("FeeDetails")
export default class FeeDetailsController {
  constructor(private req: Request) { }

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
}
