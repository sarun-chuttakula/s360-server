import { Body, Post, Route, Tags, Security, Get, Put, Path, Query } from "tsoa";
import * as messageRepository from "../repositories";

import {
  ISendMessageRequest,
  ISendMessageResponse,
  SendMessageResponseFields,
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
import { sendMessage } from "../repositories/message.repository";

@Route("message")
@Tags("Message")
export default class MessageController {
  constructor(private req: Request) {}

  @Post("/")
  public async sendMessage(
    @Body() body: ISendMessageRequest
  ): Promise<IResponseDto<ISendMessageResponse>> {
    try {
      if (!this.req.user)
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const message = await sendMessage(body, this.req.user);
      return new ApiResponse(
        true,
        mask(message, SendMessageResponseFields),
        RESPONSE_MESSAGE.MESSAGE_SENT_SUCCESSFULLY
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

  // @Get("/")
  // public async getMessages(): Promise<IResponseDto<ISendMessageResponse>> {
  //   try {
  //     const messages = await messageRepository.getMessages();
  //     return new ApiResponse(
  //       true,
  //       mask(messages, SendMessageResponseFields),
  //       RESPONSE_MESSAGE.MESSAGE_FETCHED_SUCCESSFULLY
  //     );
  //   } catch (error: any) {
  //     logger.error(error);
  //     throw new ServerErrorException(error.message);
  //   }
  // }

  @Get("/")
  public async getMessagesByGroup(
    @Query() groupId: string,
    @Query() page: string
  ): Promise<IResponseDto<ISendMessageResponse>> {
    try {
      const messages = await messageRepository.getMessagesByGroup(
        groupId,
        page
      );
      return new ApiResponse(
        true,
        mask(messages, SendMessageResponseFields),
        RESPONSE_MESSAGE.MESSAGE_FETCHED_SUCCESSFULLY
      );
    } catch (error: any) {
      logger.error(error);
      throw new ServerErrorException(error.message);
    }
  }
}
