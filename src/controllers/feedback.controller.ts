import { Body, Post, Route, Tags, Security, Get, Put, Path } from "tsoa";
import * as groupRepository from "../repositories";

import {
  INewFeedbackRequest,
  INewFeedbackResponse,
  newFeedbackResponseFields,
} from "../dtos";
import { RESPONSE_MESSAGE, ERROR_MESSAGE } from "../constants";
import e, { Request, Response } from "express";
import {
  AlreadyExistsError,
  NotFoundException,
  ServerErrorException,
  UnauthorizedException,
} from "../utils/error.util";
import logger from "../utils/logger.util";
import { ApiResponse, IResponseDto } from "../dtos/response.dto";
import mask from "../utils/mask.util";
import { createGroup } from "../repositories/group.repository";
import { createFeedback } from "../repositories/feedback.repository";

@Route("")
@Tags("Group")
export default class FeedbackController {
  constructor(private req: Request) {}

  @Post("/")
  public async createFeedback(
    @Body() body: INewFeedbackRequest
  ): Promise<IResponseDto<INewFeedbackResponse>> {
    try {
      if (!this.req.student)
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const group = await createFeedback(body, this.req.student);
      return new ApiResponse(
        true,
        mask(group, newFeedbackResponseFields),
        RESPONSE_MESSAGE.GROUP_CREATED_SUCCESSFULLY
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
