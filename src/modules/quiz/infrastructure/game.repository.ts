import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../entitys/questions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GameRepository {
  constructor(
    @InjectRepository(Question) private questionRepo: Repository<Question>,
  ) {}

  async save(): Promise<void> {}
}
