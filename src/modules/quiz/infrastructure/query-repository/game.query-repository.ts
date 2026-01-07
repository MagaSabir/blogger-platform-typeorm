import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Game, GameStatus } from '../../entitys/game.entity';
import { DataSource } from 'typeorm';
import { Player } from '../../entitys/player.entity';
import { User } from '../../../user-accounts/users/entity/user.entity';
import { Answer } from '../../entitys/answer.entity';
import { GameQuestion } from '../../entitys/game-question.entity';
import {
  GameViewModel,
  RawAnswerData,
  RawGameData,
  RawPlayerData,
} from '../../api/view-models/game-view-model';

@Injectable()
export class GameQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findGameById(gameId: string): Promise<GameViewModel | null> {
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

    const questions: {
      id: string;
      body: string;
    }[] = await this.dataSource
      .getRepository(GameQuestion)
      .createQueryBuilder('qg')
      .select(['q.id as id', 'q.body as body'])
      .leftJoin('qg.question', 'q')
      .where('qg.gameId = :gameId', { gameId })
      .orderBy('qg.order', 'ASC')
      .getRawMany();

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
        answers: answers
          .filter((a) => a.playerId === player.playerId)
          .map((a) => ({
            questionId: a.questionId,
            answerStatus: a.answerStatus,
            addedAt: a.addedAt,
          })),
        player: {
          id: player.userId,
          login: player.login,
        },
        score: player.score,
      };
    };

    return {
      id: game.id,
      firstPlayerProgress: mapPlayer(1),
      secondPlayerProgress: mapPlayer(2),
      questions: game.status === GameStatus.ACTIVE ? questions : null,
      status: game.status,
      pairCreatedDate: game.pairCreatedDate,
      startGameDate: game.startGameDate,
      finishGameDate: game.finishGameDate,
    };
  }

  async findGameUnFinishedByUserId(
    userId: string,
  ): Promise<GameViewModel | null> {
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
      .where(
        `EXISTS (
      SELECT 1 FROM "Player" p
      WHERE p."gameId" = g.id
      AND p."userId" = :userId
    )`,
        { userId },
      )
      .andWhere('g.status IN (:...statuses)', {
        statuses: [GameStatus.ACTIVE, GameStatus.PENDING],
      })
      .getRawOne();
    if (!game) return null;
    const gameId = game.id;

    const questions: {
      id: string;
      body: string;
    }[] = await this.dataSource
      .getRepository(GameQuestion)
      .createQueryBuilder('qg')
      .select(['q.id as id', 'q.body as body'])
      .leftJoin('qg.question', 'q')
      .where('qg.gameId = :gameId', { gameId })
      .orderBy('qg.order', 'ASC')
      .getRawMany();

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
        answers: answers
          .filter((a) => a.playerId === player.playerId)
          .map((a) => ({
            questionId: a.questionId,
            answerStatus: a.answerStatus,
            addedAt: a.addedAt,
          })),
        player: {
          id: player.userId,
          login: player.login,
        },
        score: player.score,
      };
    };

    return {
      id: game.id,
      firstPlayerProgress: mapPlayer(1),
      secondPlayerProgress: mapPlayer(2),
      questions: game.status === GameStatus.ACTIVE ? questions : null,
      status: game.status,
      pairCreatedDate: game.pairCreatedDate,
      startGameDate: game.startGameDate,
      finishGameDate: game.finishGameDate,
    };
  }

  async findGameByGameId(
    userId: string,
    gameId: string,
  ): Promise<GameViewModel | null> {
    const game: RawGameData | undefined = await this.dataSource
      .getRepository(Game)
      .createQueryBuilder('g')
      .innerJoinAndSelect('g.players', 'player')
      .select([
        'g.id as id',
        'g.status as status',
        'g.pairCreatedDate as "pairCreatedDate"',
        'g.startGameDate as "startGameDate"',
        'g.finishGameDate as "finishGameDate"',
      ])
      .where('g.id =:gameId', { gameId })
      // .andWhere('g.status IN (:...statuses)', {
      //   statuses: [GameStatus.ACTIVE, GameStatus.PENDING],
      // })
      .getRawOne();

    if (!game) {
      throw new NotFoundException();
    }

    const questions: {
      id: string;
      body: string;
    }[] = await this.dataSource
      .getRepository(GameQuestion)
      .createQueryBuilder('qg')
      .select(['q.id as id', 'q.body as body'])
      .leftJoin('qg.question', 'q')
      .where('qg.gameId = :gameId', { gameId })
      .orderBy('qg.order', 'ASC')
      .getRawMany();

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

    if (!players.some((l) => l.userId === userId)) {
      throw new ForbiddenException();
    }

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
        answers: answers
          .filter((a) => a.playerId === player.playerId)
          .map((a) => ({
            questionId: a.questionId,
            answerStatus: a.answerStatus,
            addedAt: a.addedAt,
          })),
        player: {
          id: player.userId,
          login: player.login,
        },
        score: player.score,
      };
    };

    return {
      id: game.id,
      firstPlayerProgress: mapPlayer(1),
      secondPlayerProgress: mapPlayer(2),
      questions: game.status === GameStatus.ACTIVE ? questions : null,
      status: game.status,
      pairCreatedDate: game.pairCreatedDate,
      startGameDate: game.startGameDate,
      finishGameDate: game.finishGameDate,
    };
  }
}
