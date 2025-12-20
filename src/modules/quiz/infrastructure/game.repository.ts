import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../entitys/game.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GameRepository {
  constructor(@InjectRepository(Game) private repo: Repository<Game>) {}

  async save(game: Game): Promise<Game> {
    return this.repo.save(game);
  }
}
