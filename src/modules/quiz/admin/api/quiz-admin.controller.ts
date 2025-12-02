import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { CreateQuestionsInputDto } from './input-dto/create-questions.input-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../entitys/questions.entity';

@Controller('sa/quiz')
export class QuizAdminController {
  constructor(
    @InjectRepository(Question) private qRepo: Repository<Question>,
  ) {}

  @Post('questions')
  async createQuestion(@Body() dto: CreateQuestionsInputDto) {
    const q = new Question();
    q.body = dto.body;
    q.correctAnswers = dto.correctAnswers;
    await q.save();
    return await this.qRepo.find();
  }

  @Delete()
  async deleteQuestion() {}
  //TODO - Удалить или обновить опубликованный вопрос не можем

  @Put()
  async updateQuestion() {}

  @Put()
  async changePublishStatus() {}
}
