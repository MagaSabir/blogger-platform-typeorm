import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function GetUsersSwaggerDecorator(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Return all users' }),
    ApiOkResponse({ description: 'Success' }),
  );
}
