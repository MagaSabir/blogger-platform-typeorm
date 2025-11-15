import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedRequest } from '../interfaces/authenticated-request';

export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const id = request.user?.id;
    const numericId = Number(id);

    return numericId || null;
  },
);
