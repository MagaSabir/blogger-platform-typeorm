import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionRepository } from '../../infrastructure/question.repository';
import { NotFoundException } from '@nestjs/common';

export class ChangeQuestionStatusCommand {
  constructor(
    public published: boolean,
    public id: string,
  ) {}
}

@CommandHandler(ChangeQuestionStatusCommand)
export class ChangeQuestionStatusUseCase
  implements ICommandHandler<ChangeQuestionStatusCommand>
{
  constructor(private questionRepo: QuestionRepository) {}

  async execute(command: ChangeQuestionStatusCommand) {
    const question = await this.questionRepo.findById(command.id);
    if (!question) throw new NotFoundException();

    if (command.published) {
      question.publish();
    } else {
      question.unpublish();
    }
    await this.questionRepo.save(question);
  }
}
