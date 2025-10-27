import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../../../core/interfaces/authenticated-request';

export const GetRefreshToken = createParamDecorator(
  (data: string, context: ExecutionContext): string => {
    const request: AuthenticatedRequest = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();
    const token: string = request.cookies['refreshToken'];
    if (!token) throw new UnauthorizedException('Token not found');
    return token;
  },
);
