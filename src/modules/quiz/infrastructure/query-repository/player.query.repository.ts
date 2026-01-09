import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../../entitys/player.entity';
import { Repository } from 'typeorm';
import { GameStatus } from '../../entitys/game.entity';
import {
  AvgScores,
  DrawsCount,
  GamesCount,
  LossesCount,
  StatisticViewModel,
  SumScore,
  WinsCount,
} from '../../api/view-models/statistic.view-model';

@Injectable()
export class PlayerQueryRepository {
  constructor(@InjectRepository(Player) private repo: Repository<Player>) {}

  async getStatistic(userId: string) {
    const sum: SumScore | undefined = await this.repo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(p.score), 0)', 'sumScore')
      .where('p.userId = :userId', { userId })
      .getRawOne();

    const avg: AvgScores | undefined = await this.repo
      .createQueryBuilder('p')
      .select('COALESCE(ROUND(AVG(p.score), 2),0)', 'avgScores')
      .where('p.userId = :userId', { userId })
      .getRawOne();

    const games: GamesCount | undefined = await this.repo
      .createQueryBuilder('p')
      .innerJoin('Game', 'g', 'g.id = p.gameId')
      .select('COUNT(p.gameId)', 'gamesCount')
      .where('p.userId = :userId', { userId })
      .andWhere('g.status = :status', { status: GameStatus.FINISHED })
      .getRawOne();

    const wins: WinsCount | undefined = await this.repo
      .createQueryBuilder('p')
      .innerJoin('Game', 'g', 'g.id = p.gameId')
      .innerJoin(
        'Player',
        'op',
        'op."gameId" = g.id AND op."userId" != p."userId"',
      )
      .select('COUNT(p."gameId")', 'winsCount')
      .where('p.userId = :userId', { userId })
      .andWhere('g.status = :status', { status: GameStatus.FINISHED })
      .andWhere('p.score > op.score')
      .getRawOne();

    const loses: LossesCount | undefined = await this.repo
      .createQueryBuilder('p')
      .innerJoin('Game', 'g', 'g.id = p.gameId')
      .innerJoin(
        'Player',
        'op',
        'op."gameId" = g.id AND op."userId" != p."userId"',
      )
      .select('COUNT(p."gameId")', 'lossesCount')
      .where('p.userId = :userId', { userId })
      .andWhere('g.status = :status', { status: GameStatus.FINISHED })
      .andWhere('p.score < op.score')
      .getRawOne();

    const draws: DrawsCount | undefined = await this.repo
      .createQueryBuilder('p')
      .innerJoin('Game', 'g', 'g.id = p.gameId')
      .innerJoin(
        'Player',
        'op',
        'op."gameId" = g.id AND op."userId" != p."userId"',
      )
      .select('COUNT(p."gameId")', 'drawsCount')
      .where('p.userId = :userId', { userId })
      .andWhere('g.status = :status', { status: GameStatus.FINISHED })
      .andWhere('p.score = op.score')
      .getRawOne();

    return StatisticViewModel.mapToView(sum, avg, games, wins, loses, draws);
  }
}
