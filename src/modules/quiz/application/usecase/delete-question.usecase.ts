import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionRepository } from '../../infrastructure/question.repository';
import { Question } from '../../entitys/questions.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export class DeleteQuestionCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionUseCase
  implements ICommandHandler<DeleteQuestionCommand>
{
  constructor(private questionRepo: QuestionRepository) {}

  async execute(command: DeleteQuestionCommand) {
    const question: Question | null = await this.questionRepo.findById(
      command.id,
    );
    if (!question) throw new NotFoundException();

    if (question.published)
      throw new BadRequestException('Question is published');

    await this.questionRepo.softDelete(question.id);
  }
}
