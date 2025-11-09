import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginViewModel } from '../view-dto/login-view-model';
import { ErrorViewModel } from '../../../../../core/view-dto/error-view-model';

export function LoginSwaggerDecorator(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Try login user to the system',
    }),
    ApiOkResponse({
      description:
        'Returns JWT accessToken (expired after 10 seconds) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 seconds).',
      type: LoginViewModel,
    }),
    ApiBadRequestResponse({
      description: 'Incorrect input data',
      type: ErrorViewModel,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiTooManyRequestsResponse({
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
}
