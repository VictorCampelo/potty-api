import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { CelebrateError, isCelebrateError } from 'celebrate';
import { ValidationError, isError as isJoiError } from 'joi';

import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: any) {}

  catch(exception: any, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.

    const ctx = host.switchToHttp();

    if (exception instanceof UnauthorizedException) {
      this.httpAdapterHost.reply(
        ctx.getResponse(),
        {
          status: 'error',
          message: 'Unauthorized',
        },
        401,
      );
      return;
    }

    if (exception instanceof HttpException) {
      this.httpAdapterHost.reply(
        ctx.getResponse(),
        {
          message: exception.getResponse(),
          status: 'error',
        },
        exception.getStatus(),
      );
      return;
    }

    if (isJoiError(exception)) {
      const result = {
        status: 'error',
        message: 'Validation Error',
        errors: {},
      };

      exception.details.forEach((err) => {
        const correctMessage = err.message.split('"')[2].trimStart();
        result.errors[err.path as any] = correctMessage;
      });

      this.httpAdapterHost.reply(ctx.getResponse(), result, 400);

      return;
    }

    if (isCelebrateError(exception)) {
      const result = {
        status: 'error',
        message: exception?.message,
        errors: {},
      } as any;

      exception.details.forEach((err) => {
        err.details.forEach((detailError: any) => {
          const correctMessage = detailError.message.split('"')[2].trimStart();
          result.errors[detailError.path] = correctMessage;
        });
      });

      this.httpAdapterHost.reply(ctx.getResponse(), result, 400);
      return;
    }

    this.httpAdapterHost.reply(
      ctx.getResponse(),
      {
        status: 'error',
        message: 'Internal server error',
      },
      500,
    );
  }
}
