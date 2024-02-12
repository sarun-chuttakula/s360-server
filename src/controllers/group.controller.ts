import { Body, Post, Route, Tags, Security, Get, Put, Path } from "tsoa";
import {
  IResponseDto,
  ApiResponse,
  INewGroupRequest,
  INewGroupResponse,
  newGroupResponseFields,
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
import mask from "../utils/mask.util";
import { createGroup } from "../repositories";

@Route("group")
@Tags("Group")
export default class GroupController {
  constructor(private req: Request) {}

  @Post("/")
  public async createGroup(
    @Body() body: INewGroupRequest
  ): Promise<IResponseDto<INewGroupResponse>> {
    try {
      if (!this.req.user)
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const group = await createGroup(body, this.req.user);
      return new ApiResponse(
        true,
        mask(group, newGroupResponseFields),
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
