import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionRepository } from '../../infrastructure/question.repository';

export class UpdateQuestionCommand {
  constructor() {}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionUseCase
  implements ICommandHandler<UpdateQuestionCommand>
{
  constructor(private questionRepo: QuestionRepository) {}

  async execute(command: UpdateQuestionCommand) {}
}
