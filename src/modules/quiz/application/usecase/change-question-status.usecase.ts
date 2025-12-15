import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionRepository } from '../../infrastructure/question.repository';

export class ChangeQuestionStatusCommand {
  constructor() {}
}

@CommandHandler(ChangeQuestionStatusCommand)
export class ChangeQuestionStatusUseCase
  implements ICommandHandler<ChangeQuestionStatusCommand>
{
  constructor(private questionRepo: QuestionRepository) {}

  async execute(command: ChangeQuestionStatusCommand) {}
}
