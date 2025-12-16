import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionRepository } from '../../infrastructure/question.repository';
import { UpdateQuestionInputDto } from '../../api/admin/input-dto/update-question.input-dto';
import { NotFoundException } from '@nestjs/common';

export class UpdateQuestionCommand {
  constructor(
    public id: string,
    public dto: UpdateQuestionInputDto,
  ) {}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionUseCase
  implements ICommandHandler<UpdateQuestionCommand>
{
  constructor(private questionRepo: QuestionRepository) {}

  async execute(command: UpdateQuestionCommand) {
    const question = await this.questionRepo.findById(command.id);
    if (!question) throw new NotFoundException();
    question.updateQuestion(command.dto.body, command.dto.correctAnswers);
    await this.questionRepo.save(question);
  }
}
