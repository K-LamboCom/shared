import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { ResponseBase } from '../constants/response_base';

export const BypassInterceptor = () => SetMetadata('bypassInterceptor', true);

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isBypassed = this.reflector.get<boolean>(
      'bypassInterceptor',
      context.getHandler(),
    );

    if (isBypassed) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = response.statusCode;
        const message = data && data.message ? data.message : 'Success';
        return new ResponseBase(statusCode, message, data).toJSON();
      }),
    );
  }
}
