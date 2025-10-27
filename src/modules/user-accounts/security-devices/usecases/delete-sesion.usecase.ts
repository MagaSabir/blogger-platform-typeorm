import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../sessions/infrastructure/session-repository';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadType } from '../../types/token-payload-type';
import { isUUID } from 'class-validator';

export class DeleteSessionCommand {
  constructor(
    public deviceId: string,
    public token: string,
  ) {}
}

@CommandHandler(DeleteSessionCommand)
export class DeleteSessionUseCase
  implements ICommandHandler<DeleteSessionCommand>
{
  constructor(
    @Inject('REFRESH-TOKEN') private jwtService: JwtService,
    private sessionRepository: SessionRepository,
  ) {}
  async execute(command: DeleteSessionCommand) {
    if (!isUUID(command.deviceId)) throw new NotFoundException();
    const session =
      await this.sessionRepository.findSessionOrThrowNotFoundException(
        command.deviceId,
      );

    const payload: TokenPayloadType = this.jwtService.verify(command.token);

    if (session.userId !== payload.userId) throw new ForbiddenException();
    if (payload.deviceId === command.deviceId) {
      throw new ForbiddenException('You cannot delete your current session');
    }

    await this.sessionRepository.deleteSessionByDeviceId(command.deviceId);
  }
}
