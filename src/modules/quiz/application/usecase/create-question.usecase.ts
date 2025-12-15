import { CreateQuestionsInputDto } from '../../api/admin/input-dto/create-questions.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionRepository } from '../../infrastructure/question.repository';
import { Question } from '../../entitys/questions.entity';

export class CreateQuestionCommand {
  constructor(public dto: CreateQuestionsInputDto) {}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionUseCase
  implements ICommandHandler<CreateQuestionCommand>
{
  constructor(private questionRepo: QuestionRepository) {}

  async execute(command: CreateQuestionCommand) {
    const { body, correctAnswers } = command.dto;
    const question = Question.createQuestion(body, correctAnswers);
    const createdQuestion = await this.questionRepo.save(question);
    return createdQuestion;
  }
}
