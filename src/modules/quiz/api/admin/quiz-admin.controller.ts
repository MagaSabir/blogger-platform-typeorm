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
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateQuestionsInputDto } from './input-dto/create-questions.input-dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateQuestionCommand } from '../../application/usecase/create-question.usecase';
import { QuestionViewModel } from '../view-models/Question-view-model';
import { DeleteQuestionCommand } from '../../application/usecase/delete-question.usecase';
import { PublishQuestionInputDto } from './input-dto/publish-question.input-dto';
import { ChangeQuestionStatusCommand } from '../../application/usecase/change-question-status.usecase';
import { UpdateQuestionInputDto } from './input-dto/update-question.input-dto';
import { UpdateQuestionCommand } from '../../application/usecase/update-question.usecase';
import { BasicAuthGuard } from '../../../user-accounts/guards/basic/basic-auth.guard';
import { QuestionQueryParams } from './input-dto/question-query-params';
import { GetQuestionQuery } from '../../application/queries/get-questions.query';
import { Question } from '../../entitys/questions.entity';
import { QuestionQueryRepository } from '../../infrastructure/question-query-repository';

@Controller('sa/quiz/questions')
@UseGuards(BasicAuthGuard)
export class QuizAdminController {
  constructor(
    private queryRepo: QuestionQueryRepository,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get()
  async getQuestions(@Query() query: QuestionQueryParams) {
    return this.queryBus.execute(new GetQuestionQuery(query));
  }

  @Post()
  async createQuestion(
    @Body() dto: CreateQuestionsInputDto,
  ): Promise<QuestionViewModel> {
    const question: Question = await this.commandBus.execute(
      new CreateQuestionCommand(dto),
    );
    return this.queryRepo.getQuestion(question.id);
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
