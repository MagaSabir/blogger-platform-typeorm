import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionRepository } from '../../../sessions/infrastructure/session-repository';
import { randomUUID } from 'crypto';
import { Session } from '../../../sessions/entity/session.entity';

export class LoginUserCommand {
  constructor(
    public userId: number,
    public ip: string,
    public userAgent: string,
  ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  constructor(
    @Inject('ACCESS-TOKEN') private accessTokenContext: JwtService,
    @Inject('REFRESH-TOKEN') private refreshTokenContext: JwtService,
    private sessionRepo: SessionRepository,
  ) {}

  async execute(command: LoginUserCommand) {
    const deviceId: string = randomUUID();

    const accessToken = this.accessTokenContext.sign({
      userId: command.userId,
    });
    const refreshToken = this.refreshTokenContext.sign({
      userId: command.userId,
      deviceId,
    });

    const payload: { iat: number; exp: number } =
      this.refreshTokenContext.verify(refreshToken);

    const session = Session.createSession({
      userId: command.userId,
      deviceId,
      userAgent: command.userAgent,
      ip: command.ip,
      lastActiveDate: new Date(payload.iat * 1000),
      expiresAt: new Date(payload.exp * 1000),
    });
    await this.sessionRepo.save(session);
    return {
      accessToken,
      refreshToken,
    };
  }
}
