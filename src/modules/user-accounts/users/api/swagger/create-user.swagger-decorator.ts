import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UserViewModel } from '../view-dto/user-view-model';
import { ErrorViewModel } from '../../../../../core/view-dto/error-view-model';

export function CreateUserSwaggerDecorator(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Add new user to system' }),
    ApiCreatedResponse({
      description: 'Data for constructing new user',
      type: UserViewModel,
    }),
    ApiBadRequestResponse({
      description: 'Incorrect input data',
      type: ErrorViewModel,
    }),
  );
}
