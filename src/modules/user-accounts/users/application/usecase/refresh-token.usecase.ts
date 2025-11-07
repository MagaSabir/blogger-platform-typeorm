import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionRepository } from '../../../sessions/infrastructure/session-repository';
import { TokenPayloadType } from '../../../types/token-payload-type';
import { Session } from '../../../sessions/entity/session.entity';

export class RefreshTokenCommand {
  constructor(public token: string) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    @Inject('ACCESS-TOKEN') private accessTokenContext: JwtService,
    @Inject('REFRESH-TOKEN') private refreshTokenContext: JwtService,
    private sessionRepository: SessionRepository,
  ) {}

  async execute(
    command: RefreshTokenCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: TokenPayloadType = this.refreshTokenContext.verify(
      command.token,
    );
    const { userId, deviceId } = payload;
    const accessToken: string = this.accessTokenContext.sign({ userId });
    const refreshToken: string = this.refreshTokenContext.sign({
      userId,
      deviceId,
    });
    const session: Session | null = await this.sessionRepository.findSession(
      userId,
      deviceId,
    );

    if (!session) throw new UnauthorizedException('Session not found');
    const newPayload: TokenPayloadType =
      this.refreshTokenContext.verify(refreshToken);

    session.updateSession(
      new Date(newPayload.iat * 1000),
      new Date(newPayload.exp * 1000),
    );
    await this.sessionRepository.save(session);
    return { accessToken, refreshToken };
  }
}
