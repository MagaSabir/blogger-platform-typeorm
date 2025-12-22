import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Game, GameStatus } from '../../entitys/game.entity';
import { DataSource } from 'typeorm';
import { Player } from '../../entitys/player.entity';
import { User } from '../../../user-accounts/users/entity/user.entity';
import { Answer } from '../../entitys/answer.entity';

export type AnswerStatus = 'Correct' | 'Incorrect';

export type RawGameData = {
  id: string;
  status: GameStatus;
  pairCreatedDate: Date;
  startGameDate: Date | null;
  finishGameDate: Date | null;
};

export type RawPlayerData = {
  playerId: string;
  position: number;
  score: number;
  userId: string;
  login: string;
};

export type RawAnswerData = {
  questionId: string;
  answerStatus: AnswerStatus;
  addedAt: Date;
  playerId: string;
};

@Injectable()
export class GameQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findGameById(gameId: string) {
    const game: RawGameData | undefined = await this.dataSource
      .getRepository(Game)
      .createQueryBuilder('g')
      .select([
        'g.id as id',
        'g.status as status',
        'g.pairCreatedDate as "pairCreatedDate"',
        'g.startGameDate as "startGameDate"',
        'g.finishGameDate as "finishGameDate"',
      ])
      .where('g.id = :gameId', { gameId })
      .getRawOne();
    if (!game) return null;

    const players: RawPlayerData[] = await this.dataSource
      .getRepository(Player)
      .createQueryBuilder('p')
      .select([
        'p.id as "playerId"',
        'p.position as "position"',
        'p.score as score',
        'u.id as "userId"',
        'u.login as login',
      ])
      .leftJoin(User, 'u', 'u.id = p."userId"')
      .where('p.gameId = :gameId', { gameId })
      .getRawMany();

    const answers: RawAnswerData[] = await this.dataSource
      .getRepository(Answer)
      .createQueryBuilder('a')
      .select([
        'a.questionId as "questionId"',
        'a.status as "answerStatus"',
        'a.addedAt as "addedAt"',
        'a.playerId as "playerId"',
      ])
      .where('a.playerId IN (:...playerIds)', {
        playerIds: players.map((p) => p.playerId),
      })
      .getRawMany();

    const mapPlayer = (position: 1 | 2) => {
      const player = players.find((p) => p.position === position);
      if (!player) return null;

      return {
        answers: answers.filter((a) => a.playerId === player.playerId),
        player: {
          id: player.userId,
          login: player.login,
        },
        score: player.score,
      };
    };

    return {
      id: game.id,
      status: game.status,
      pairCreatedDate: game.pairCreatedDate,
      startGameDate: game.startGameDate,
      finishGameDate: game.finishGameDate,
      firstPlayerProgress: mapPlayer(1),
      secondPlayerProgress: mapPlayer(2),
    };
  }
}
