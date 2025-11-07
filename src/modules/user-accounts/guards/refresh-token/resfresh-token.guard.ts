import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionRepository } from '../../sessions/infrastructure/session-repository';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadType } from '../../types/token-payload-type';
import { AuthenticatedRequest } from '../../../../core/interfaces/authenticated-request';
import { Session } from '../../sessions/entity/session.entity';

export class RefreshTokenGuard implements CanActivate {
  constructor(
    private sessionRepository: SessionRepository,
    @Inject('REFRESH-TOKEN') private refreshTokenContext: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();
    const token: string = request.cookies['refreshToken'];

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: TokenPayloadType = this.refreshTokenContext.verify(token);
      const sessions: Session | null = await this.sessionRepository.findSession(
        payload.userId,
        payload.deviceId,
      );

      if (
        !sessions ||
        Math.floor(sessions.lastActiveDate.getTime()) / 1000 !== payload.iat
      ) {
        throw new UnauthorizedException('Invalid session');
      }

      request.payload = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh Token');
    }
  }
}
