export interface IResponseDto<T = any> {
  /** Tells the success status of the API */
  success: boolean;
  /** Data to be passed as response */
  data: T;
  /** API status message */
  message: string;
}

export class ApiResponse<T> implements IResponseDto<T> {
  constructor(
    public success: boolean,
    public data: T,
    public message: string = ""
  ) {}
}
export class ErrorResponse<T> implements IResponseDto<T> {
  stack: string | undefined;
  constructor(
    public success: boolean,
    public data: T,
    public message: string = "",
    stack?: string | undefined
  ) {
    if (stack && process.env.NODE_ENV === "development") this.stack = stack;
    else this.stack = undefined;
  }
}
