import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { DomainException } from '../domain.exceptions';
import { DomainExceptionCodes } from '../domain-exception-codes';
import { Response, Request } from 'express';

@Catch(DomainException)
export class DomainHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = this.mapToHttpStatus(exception.code);
    const responseBody = this.buildResponseBody(exception);

    response.status(status).json(responseBody);
  }

  private mapToHttpStatus(code: DomainExceptionCodes) {
    switch (code) {
      case DomainExceptionCodes.BadRequest:
      case DomainExceptionCodes.ValidationError:
      case DomainExceptionCodes.ConfirmationCodeExpired:
      case DomainExceptionCodes.PasswordRecoveryCodeExpired:
        return HttpStatus.BAD_REQUEST;
      case DomainExceptionCodes.Forbidden:
        return HttpStatus.FORBIDDEN;
      case DomainExceptionCodes.NotFound:
        return HttpStatus.NOT_FOUND;
      case DomainExceptionCodes.Unauthorized:
        return HttpStatus.UNAUTHORIZED;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private buildResponseBody(exception: DomainException) {
    return {
      errorsMessages: exception.extensions,
    };
  }
}
