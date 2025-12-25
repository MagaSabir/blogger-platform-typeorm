import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, GameStatus } from '../entitys/game.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GameRepository {
  constructor(@InjectRepository(Game) private repo: Repository<Game>) {}

  async save(game: Game): Promise<void> {
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

  async findActiveGameByUserId(userId: string) {
    return this.repo
      .createQueryBuilder('g')
      .innerJoin('g.players', 'player')
      .where('player.userId =:userId', { userId })
      .andWhere('g.status IN (:...statuses)', {
        statuses: [GameStatus.ACTIVE, GameStatus.PENDING],
      })
      .getOne();
  }
}
