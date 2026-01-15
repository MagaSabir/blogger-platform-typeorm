import { Repository } from 'typeorm';
import { Statistic } from '../../entitys/statistic.entity';
import { Player } from '../../entitys/player.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayerStatsService {
  constructor() {}
  async updateStats(p1: Player, p2: Player, repo: Repository<Statistic>) {
    const [s1, s2] = await Promise.all([
      this.findOrCreateStats(p1.userId, repo),
      this.findOrCreateStats(p2.userId, repo),
    ]);

    s1.gamesCount += 1;
    s2.gamesCount += 1;

    s1.sumScore += p1.score;
    s2.sumScore += p2.score;

    if (p1.score > p2.score) {
      s1.wins += 1;
      s2.loses += 1;
    } else if (p2.score > p1.score) {
      s2.wins += 1;
      s1.loses += 1;
    } else {
      s1.draws += 1;
      s2.draws += 1;
    }

    s1.avgScore = s1.sumScore / s1.gamesCount;
    s2.avgScore = s2.sumScore / s2.gamesCount;

    await repo.save([s1, s2]);
  }
  async findOrCreateStats(userId: string, repo: Repository<Statistic>) {
    let stats: Statistic | null = await repo.findOneBy({ userId });
    if (!stats) {
      stats = repo.create({ userId });
      await repo.save(stats);
    }
    return stats;
  }
}
