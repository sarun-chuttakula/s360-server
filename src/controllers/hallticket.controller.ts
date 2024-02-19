import { Get, Post, Query, Route, Tags } from "tsoa";
import { ERROR_MESSAGE } from "../constants";
import e, { Request } from "express";
import {
  AlreadyExistsError,
  ServerErrorException,
  UnauthorizedException,
} from "../utils/error.util";
import logger from "../utils/logger.util";
import { getHallticket, getResultbyHallticket } from "../repositories";

@Route("hallticket")
@Tags("HallTicket")
export default class HallTicketController {
  constructor(private req: Request) {}

  @Get("/")
  public async getHallticket() {
    try {
      if (!this.req.student)
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const hallticket = await getHallticket(this.req.student);
      return hallticket;
    } catch (error: any) {
      logger.error(error);
      if (error.statusCode === 409) {
        throw new AlreadyExistsError(error.message);
      } else {
        throw new ServerErrorException(error.message);
      }
    }
  }

  @Get("/result")
  public async getResultbyHallticket(
    @Query() semester: string,
    @Query() ht_no: string
  ) {
    try {
      if (!(this.req.student || this.req.user))
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const user = this.req.student || this.req.user;
      if (!user)
        throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
      const result = await getResultbyHallticket(ht_no, semester, user);
      return result;
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
