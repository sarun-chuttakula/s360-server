import { Body, Post, Route, Tags, Security, Get, Put, Path } from "tsoa";
import * as noticeboard from "../repositories";

import {
  INewNoticeboardRequest,
  INewNoticeboardResponse,
  newNoticeboardResponseFields,
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
import {
  createNotice,
  getAllNotices,
} from "../repositories/noticeboard.repository";

@Route("noticeboard")
@Tags("Noticeboard")
export default class NoticeboardController {
  constructor(private req: Request) {}

  @Post("/")
  public async createNotice(
    @Body() body: INewNoticeboardRequest
  ): Promise<IResponseDto<INewNoticeboardResponse>> {
    try {
      if (!this.req.user)
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const group = await createNotice(body, this.req.user);
      return new ApiResponse(
        true,
        mask(group, newNoticeboardResponseFields),
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
  public async getAllNotices(): Promise<
    IResponseDto<INewNoticeboardResponse[]>
  > {
    try {
      const notices = await getAllNotices();
      return new ApiResponse(
        true,
        mask(notices, newNoticeboardResponseFields),
        RESPONSE_MESSAGE.NOTICES_FETCHED_SUCCESSFULLY
      );
    } catch (error: any) {
      logger.error(error);
      throw new ServerErrorException(error.message);
    }
  }

  // @Get("/:id")
  // public async getNoticeById(
  //   @Path() id: string
  // ): Promise<IResponseDto<INewNoticeboardResponse>> {
  //   try {
  //     const notice = await noticeboard.getNoticeById(id);
  //     if (!notice) {
  //       throw new NotFoundException(ERROR_MESSAGE.NOTICE_NOT_FOUND);
  //     }
  //     return new ApiResponse(
  //       true,
  //       mask(notice, newNoticeboardResponseFields),
  //       RESPONSE_MESSAGE.NOTICE_FETCHED_SUCCESSFULLY
  //     );
  //   } catch (error: any) {
  //     logger.error(error);
  //     throw new ServerErrorException(error.message);
  //   }
  // }

  // @Put("/:id")
  // public async updateNotice(
  //   @Path() id: string,
  //   @Body() body: INewNoticeboardRequest
  // ): Promise<IResponseDto<INewNoticeboardResponse>> {
  //   try {
  //     if (!this.req.user)
  //       throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
  //     const notice = await noticeboard.updateNotice(id, body, this.req.user);
  //     if (!notice) {
  //       throw new NotFoundException(ERROR_MESSAGE.NOTICE_NOT_FOUND);
  //     }
  //     return new ApiResponse(
  //       true,
  //       mask(notice, newNoticeboardResponseFields),
  //       RESPONSE_MESSAGE.NOTICE_UPDATED_SUCCESSFULLY
  //     );
  //   } catch (error: any) {
  //     logger.error(error);
  //     throw new ServerErrorException(error.message);
  //   }
  // }

  // @Post("/:id")
  // public async deleteNotice(
  //   @Path() id: string
  // ): Promise<IResponseDto<INewNoticeboardResponse>> {
  //   try {
  //     if (!this.req.user)
  //       throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
  //     const notice = await noticeboard.deleteNotice(id, this.req.user);
  //     if (!notice) {
  //       throw new NotFoundException(RESPONSE_MESSAGE.NOTICE_NOT_FOUND);
  //     }
  //     return new ApiResponse(
  //       true,
  //       mask(notice, newNoticeboardResponseFields),
  //       RESPONSE_MESSAGE.NOTICE_DELETED_SUCCESSFULLY
  //     );
  //   } catch (error: any) {
  //     logger.error(error);
  //     throw new ServerErrorException(error.message);
  //   }
  // }
}
