import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionRepository } from '../../infrastructure/question.repository';
import { Question } from '../../entitys/questions.entity';

export class DeleteQuestionCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionUseCase
  implements ICommandHandler<DeleteQuestionCommand>
{
  constructor(private questionRepo: QuestionRepository) {}

  async execute(command: DeleteQuestionCommand) {
    const question: Question =
      await this.questionRepo.findNoPublishedQuestionById(command.id);
    await this.questionRepo.softDelete(question.id);
  }
}
