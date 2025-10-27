import { applyDecorators } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function DeleteUserSwaggerDecorator(): MethodDecorator {
  return applyDecorators(
    ApiNoContentResponse({ description: 'No content' }),
    ApiNotFoundResponse({ description: 'If specified user is not exists' }),
    ApiOperation({
      summary: 'Delete user specified by id',
    }),
  );
}
