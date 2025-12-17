import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../entitys/game.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GameRepository {
  constructor(@InjectRepository(Game) private gameRepo: Repository<Game>) {}

  async findActiveGame(userId: string) {}
}
