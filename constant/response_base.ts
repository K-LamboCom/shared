export class ResponseBase {
  public readonly statusCode: number;
  public readonly message: string;
  public readonly data: any;
  public success?: boolean;

  constructor(statusCode: number, message: string, data?: any) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  toJSON(): any {
    return {
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
    };
  }
}
