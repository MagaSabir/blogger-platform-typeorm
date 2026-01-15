import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../../entitys/player.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
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
import { TopGameQueryParams } from '../../api/admin/input-dto/top-game.query-params';
import { SortParam } from '../../api/admin/input-dto/sort-custom.pipe';
import { Statistic } from '../../entitys/statistic.entity';
import { GameViewModelMapper } from '../../api/view-models/game-view-model.mapper';

@Injectable()
export class PlayerQueryRepository {
  constructor(
    @InjectRepository(Player) private repo: Repository<Player>,
    @InjectRepository(Statistic) private statsRepo: Repository<Statistic>,
  ) {}

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

  async getTopUsers(
    userId: string,
    queryParams: TopGameQueryParams,
    sort: SortParam[],
  ) {
    const topQB: SelectQueryBuilder<Statistic> = this.statsRepo
      .createQueryBuilder('t')
      .innerJoin('Users', 'u', 'u.id = t.userId')
      .select([
        't.sumScore as "sumScore"',
        't.gamesCount as "gamesCount"',
        't.wins as "winsCount"',
        't.loses as "lossesCount"',
        't.draws as "drawsCount"',
        't.avgScore as "avgScores"',
        'u.id as id',
        'u.login as login',
      ]);
    for (const s of sort) {
      topQB.addOrderBy(`"${s.field}"`, s.sorDirection);
    }
    topQB.offset(queryParams.calculateSkip()).limit(queryParams.pageSize);

    const raws = await topQB.getRawMany();
    const totalCount = await this.statsRepo.count();
    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items: raws.map((r) => ({
        sumScore: Number(r.sumScore),
        avgScores: Number(Number(r.avgScores).toFixed(2)),
        gamesCount: Number(r.gamesCount),
        winsCount: Number(r.winsCount),
        lossesCount: Number(r.lossesCount),
        drawsCount: Number(r.drawsCount),
        player: {
          id: r.id,
          login: r.login,
        },
      })),
    };
  }
}
