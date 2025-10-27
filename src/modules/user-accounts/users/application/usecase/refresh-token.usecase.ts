import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionRepository } from '../../../sessions/infrastructure/session-repository';
import { TokenPayloadType } from '../../../types/token-payload-type';

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
    const newSessionToken: TokenPayloadType =
      this.refreshTokenContext.verify(refreshToken);
    console.log(new Date(newSessionToken.exp));
    await this.sessionRepository.updateSessionToken(newSessionToken);
    return { accessToken, refreshToken };
  }
}
