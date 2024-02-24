import {
  Body,
  Post,
  Route,
  Tags,
  Security,
  Get,
  Put,
  Path,
  Query,
  Res,
} from "tsoa";

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
import { generate_json } from "../utils/folders.util";
import multer from "multer";
import path from "path";
import fs from "fs";
@Route("library")
@Tags("Library")
export default class LibraryController {
  constructor(private req: Request) {}

  @Get("/")
  public async getDirectories(@Query() path: string): Promise<any> {
    try {
      if (!(this.req.user || this.req.student))
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const fullpath = this.req.user
        ? `/Users/ch.sarun/Documents/MyCodes/Code/Projects/S360/s360-server/src/thumbnails/`
        : `/Users/ch.sarun/Documents/MyCodes/Code/Projects/S360/s360-server/src/thumbnails/${path}`;
      const folderStructure = await generate_json(fullpath);
      return new ApiResponse(
        true,
        folderStructure,
        RESPONSE_MESSAGE.ATTENDANCE_CREATE
      );
    } catch (error: any) {
      logger.error(error);
      throw new ServerErrorException(error.message);
    }
  }

  @Get("/api/download/")
  public async downloadFile(
    @Query("path") filePath: string,
    @Res() res: Response
  ): Promise<void> {
    try {
      if (!(this.req.user || this.req.student))
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);

      const fullPath = this.req.user
        ? `/Users/ch.sarun/Documents/MyCodes/Code/Projects/S360/s360-server/src/${filePath}`
        : `/Users/ch.sarun/Documents/MyCodes/Code/Projects/S360/s360-server/src/thumbnails/${filePath}`;
      console.log(fullPath);
      if (fs.existsSync(fullPath)) {
        res.download(fullPath);
      } else {
        throw new NotFoundException("File not found");
      }
    } catch (error: any) {
      // Log the error or handle it as needed
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
}
