import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../entitys/questions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionRepository {
  constructor(
    @InjectRepository(Question) private questionRepo: Repository<Question>,
  ) {}

  async save(question: Question): Promise<Question> {
    return this.questionRepo.save(question);
  }

  async softDelete(id: string) {
    await this.questionRepo.softDelete(id);
  }

  async findNoPublishedQuestionById(id: string): Promise<Question> {
    const question: Question | null = await this.questionRepo.findOne({
      where: [{ id, published: false }],
    });

    if (!question) throw new NotFoundException();
    return question;
  }
}
