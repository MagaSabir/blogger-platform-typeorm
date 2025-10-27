import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { SessionRepository } from '../../sessions/infrastructure/session-repository';
import { Inject } from '@nestjs/common';
import { TokenPayloadType } from '../../types/token-payload-type';

export class DeleteOtherActiveSessionCommand {
  constructor(public token: string) {}
}

@CommandHandler(DeleteOtherActiveSessionCommand)
export class DeleteOtherActiveSessionUseCase
  implements ICommandHandler<DeleteOtherActiveSessionCommand>
{
  constructor(
    @Inject('REFRESH-TOKEN') private jwtService: JwtService,
    private sessionRepository: SessionRepository,
  ) {}

  async execute(command: DeleteOtherActiveSessionCommand) {
    const payload: TokenPayloadType = this.jwtService.verify(command.token);
    await this.sessionRepository.deleteOtherActiveSessions(
      payload.userId,
      payload.deviceId,
    );
  }
}
