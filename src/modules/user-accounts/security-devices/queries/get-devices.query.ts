import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../sessions/infrastructure/session-repository';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadType } from '../../types/token-payload-type';

export class GetDevicesQuery {
  constructor(public token: string) {}
}

@QueryHandler(GetDevicesQuery)
export class GetDevicesQueryHandler implements IQueryHandler<GetDevicesQuery> {
  constructor(
    private sessionRepository: SessionRepository,
    @Inject('REFRESH-TOKEN') private refreshTokenContext: JwtService,
  ) {}

  async execute(query: GetDevicesQuery) {
    const payload: TokenPayloadType = this.refreshTokenContext.verify(
      query.token,
    );
    const now = Math.floor(Date.now() / 1000);
    return this.sessionRepository.getDeviceSession(payload.userId, now);
  }
}
