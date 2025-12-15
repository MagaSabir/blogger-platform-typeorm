import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateQuestionsInputDto } from './input-dto/create-questions.input-dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateQuestionCommand } from '../../application/usecase/create-question.usecase';
import { QuestionViewModel } from '../view-models/Question-view-model';
import { DeleteQuestionCommand } from '../../application/usecase/delete-question.usecase';

@Controller('sa/quiz/questions')
export class QuizAdminController {
  constructor(private commandBus: CommandBus) {}

  @Post()
  async createQuestion(
    @Body() dto: CreateQuestionsInputDto,
  ): Promise<QuestionViewModel> {
    return this.commandBus.execute(new CreateQuestionCommand(dto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuestion(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteQuestionCommand(id));
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateQuestion() {}

  @Put(':id/publish')
  async changePublishStatus() {}
}
