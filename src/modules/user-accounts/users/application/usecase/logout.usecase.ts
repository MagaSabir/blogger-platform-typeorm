import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionRepository } from '../../../sessions/infrastructure/session-repository';
import { TokenPayloadType } from '../../../types/token-payload-type';

export class LogoutCommand {
  constructor(public token: string) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  constructor(
    @Inject('REFRESH-TOKEN') private refreshTokenContext: JwtService,
    private sessionsRepository: SessionRepository,
  ) {}

  async execute(command: LogoutCommand) {
    const payload: TokenPayloadType = this.refreshTokenContext.verify(
      command.token,
    );
    await this.sessionsRepository.deleteSession(
      payload.userId,
      payload.deviceId,
    );
  }
}
