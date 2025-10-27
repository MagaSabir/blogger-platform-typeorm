import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionRepository } from '../../../sessions/infrastructure/session-repository';
import { v4 as uuidv4 } from 'uuid';
import { CreateSessionDto } from '../../../sessions/dto/CreateSessionDto';

export class LoginUserCommand {
  constructor(
    public userId: string,
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
    const deviceId: string = uuidv4();

    const accessToken = this.accessTokenContext.sign({
      userId: command.userId,
    });
    const refreshToken = this.refreshTokenContext.sign({
      userId: command.userId,
      deviceId,
    });

    const payload: { iat: number; exp: number } =
      this.refreshTokenContext.verify(refreshToken);

    const session: CreateSessionDto = {
      userId: command.userId,
      deviceId,
      userAgent: command.userAgent,
      ip: command.ip,
      lastActiveDate: new Date(payload.iat * 1000),
      expiresAt: new Date(payload.exp * 1000),
    };
    await this.sessionRepo.createSession(session);
    return {
      accessToken,
      refreshToken,
    };
  }
}
