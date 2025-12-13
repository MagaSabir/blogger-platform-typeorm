import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { CreateQuestionsInputDto } from './input-dto/create-questions.input-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../../entitys/questions.entity';

@Controller('sa/quiz')
export class QuizAdminController {
  constructor(
    @InjectRepository(Question) private qRepo: Repository<Question>,
  ) {}

  @Post('questions')
  async createQuestion(@Body() dto: CreateQuestionsInputDto) {
    const question = new Question();
    question.body = dto.body;
    question.correctAnswers = dto.correctAnswers;
    await question.save();
    return question;
  }

  @Delete()
  async deleteQuestion() {}
  //TODO - Удалить или обновить опубликованный вопрос не можем

  @Put()
  async updateQuestion() {}

  @Put()
  async changePublishStatus() {}
}
