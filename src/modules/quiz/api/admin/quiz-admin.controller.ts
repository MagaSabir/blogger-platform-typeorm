import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateQuestionsInputDto } from './input-dto/create-questions.input-dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateQuestionCommand } from '../../application/usecase/create-question.usecase';
import { QuestionViewModel } from '../view-models/Question-view-model';
import { DeleteQuestionCommand } from '../../application/usecase/delete-question.usecase';
import { PublishQuestionInputDto } from './input-dto/publish-question.input-dto';
import { ChangeQuestionStatusCommand } from '../../application/usecase/change-question-status.usecase';
import { UpdateQuestionInputDto } from './input-dto/update-question.input-dto';
import { UpdateQuestionCommand } from '../../application/usecase/update-question.usecase';
import { BasicAuthGuard } from '../../../user-accounts/guards/basic/basic-auth.guard';

@Controller('sa/quiz/questions')
@UseGuards(BasicAuthGuard)
export class QuizAdminController {
  constructor(private commandBus: CommandBus) {}

  @Get()
  async getQuestions() {
    return 'question';
  }

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
  async updateQuestion(
    @Param('id') id: string,
    @Body() dto: UpdateQuestionInputDto,
  ) {
    await this.commandBus.execute(new UpdateQuestionCommand(id, dto));
  }

  @Put(':id/publish')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePublishStatus(
    @Param('id') id: string,
    @Body() dto: PublishQuestionInputDto,
  ) {
    await this.commandBus.execute(
      new ChangeQuestionStatusCommand(dto.published, id),
    );
  }
}
