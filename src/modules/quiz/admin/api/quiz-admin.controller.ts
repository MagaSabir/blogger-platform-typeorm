import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { CreateQuestionsInputDto } from './input-dto/create-questions.input-dto';

@Controller('sa/quiz')
export class QuizAdminController {
  constructor() {}

  @Post('questions')
  async createQuestion(@Body() dto: CreateQuestionsInputDto) {
    return dto;
  }

  @Delete()
  async deleteQuestion() {}
  //TODO - Удалить или обновить опубликованный вопрос не можем

  @Put()
  async updateQuestion() {}

  @Put()
  async changePublishStatus() {}
}
