import {
  Body,
  Post,
  Route,
  Tags,
  Security,
  Get,
  Put,
  Path,
  Delete,
  Query,
} from "tsoa";
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
import {
  createGroup,
  deleteGroup,
  getAllGroups,
} from "../repositories/group.repository";

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

  @Get("/")
  public async getAllGroups(): Promise<IResponseDto<INewGroupResponse>> {
    try {
      const groups = await getAllGroups();
      return new ApiResponse(
        true,
        mask(groups, newGroupResponseFields),
        RESPONSE_MESSAGE.GROUP_FETCHED_SUCCESSFULLY
      );
    } catch (error: any) {
      logger.error(error);
      throw new ServerErrorException(error.message);
    }
  }

  @Put("/")
  public async updateGroup(
    @Body() body: INewGroupRequest
  ): Promise<IResponseDto<INewGroupResponse>> {
    try {
      if (!this.req.user)
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const group = await createGroup(body, this.req.user);
      return new ApiResponse(
        true,
        mask(group, newGroupResponseFields),
        RESPONSE_MESSAGE.GROUP_DELETED
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

  @Delete("/")
  public async deleteGroup(
    @Query() groupId: string
  ): Promise<IResponseDto<INewGroupResponse>> {
    try {
      if (!this.req.user)
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const group = await deleteGroup(groupId, this.req.user);
      return new ApiResponse(
        true,
        mask(group, newGroupResponseFields),
        RESPONSE_MESSAGE.GROUP_DELETED_SUCCESSFULLY
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
