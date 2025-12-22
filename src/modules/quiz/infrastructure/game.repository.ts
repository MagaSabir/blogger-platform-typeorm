import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, GameStatus } from '../entitys/game.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class GameRepository {
  constructor(@InjectRepository(Game) private repo: Repository<Game>) {}

  async save(game: Game) {
    await this.repo.save(game);
  }

  async findPendingGame() {
    return this.repo.findOne({
      where: {
        status: GameStatus.PENDING,
      },
      relations: ['players'],
    });
  }
}
