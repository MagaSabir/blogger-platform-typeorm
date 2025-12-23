import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class MyCurrentCommand {
  constructor() {}
}

@CommandHandler(MyCurrentCommand)
export class MyCurrentUseCase implements ICommandHandler<MyCurrentCommand> {
  constructor() {}

  async execute() {}
}
