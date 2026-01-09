export class StatisticViewModel {
  sumScore: number;
  avgScores: number;
  gamesCount: number;
  winsCount: number;
  lossesCount: number;
  drawsCount: number;

  static mapToView(
    sum?: SumScore,
    avg?: AvgScores,
    games?: GamesCount,
    wins?: WinsCount,
    losses?: LossesCount,
    draws?: DrawsCount,
  ): StatisticViewModel {
    return {
      sumScore: Number(sum?.sumScore ?? 0),
      avgScores: Number(avg?.avgScores ?? 0),
      gamesCount: Number(games?.gamesCount ?? 0),
      winsCount: Number(wins?.winsCount ?? 0),
      lossesCount: Number(losses?.lossesCount ?? 0),
      drawsCount: Number(draws?.drawsCount ?? 0),
    };
  }
}

export interface SumScore {
  sumScore: string;
}
export interface AvgScores {
  avgScores: string;
}

export interface GamesCount {
  gamesCount: string;
}

export interface WinsCount {
  winsCount: string;
}
export interface LossesCount {
  lossesCount: string;
}
export interface DrawsCount {
  drawsCount: string;
}
