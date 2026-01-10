import { Injectable, NotFoundException } from '@nestjs/common';
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
  RawQuestionData,
} from '../../api/view-models/game-view-model';
import { GameQueryParams } from '../../api/admin/input-dto/game.query-params';
import { GameViewModelMapper } from '../../api/view-models/game-view-model.mapper';

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
    return this.buildGameViewModel(game);
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
    return this.buildGameViewModel(game);
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
      .getRawOne();

    if (!game) {
      throw new NotFoundException();
    }
    return this.buildGameViewModel(game);
  }

  async findMyGame(userId: string, query: GameQueryParams) {
    const games: RawGameData[] = await this.dataSource
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
        `EXISTS(SELECT 1 FROM "Player" p WHERE p."gameId" = g.id AND p."userId" = :userId)`,
        { userId },
      )
      .andWhere(`g.status != 'PendingSecondPlayer'`)
      .orderBy({ [`"${query.sortBy}"`]: query.sortDirection })
      .addOrderBy('g.pairCreatedDate', 'DESC')
      .offset(query.calculateSkip())
      .limit(query.pageSize)
      .getRawMany();
    if (games.length === 0) return null;

    const gameIds: string[] = games.map((g) => g.id);

    const players: RawPlayerData[] = await this.dataSource
      .getRepository(Player)
      .createQueryBuilder('p')
      .select([
        'p.id as "playerId"',
        'p.gameId as "gameId"',
        'p.position as "position"',
        'p.score as score',
        'u.id as "userId"',
        'u.login as login',
      ])
      .leftJoin(User, 'u', 'u.id = p."userId"')
      .where('p.gameId IN (:...gameIds)', { gameIds })
      .getRawMany();

    const answers: RawAnswerData[] = await this.dataSource
      .getRepository(Answer)
      .createQueryBuilder('a')
      .select([
        'a.questionId as "questionId"',
        'p.gameId as "gameId"',
        'a.status as "answerStatus"',
        'a.addedAt as "addedAt"',
        'a.playerId as "playerId"',
      ])
      .leftJoin('Player', 'p', 'p.id = a."playerId"')
      .where('a.playerId IN (:...playerIds)', {
        playerIds: players.map((p) => p.playerId),
      })
      .orderBy('a.addedAt', 'ASC')
      .getRawMany();

    const questions: RawQuestionData[] = await this.dataSource
      .getRepository(GameQuestion)
      .createQueryBuilder('qg')
      .select(['q.id as id', 'q.body as body', 'qg.gameId as "gameId"'])
      .leftJoin('qg.question', 'q')
      .where('qg.gameId IN (:...gameIds)', { gameIds })
      .orderBy('qg.order', 'ASC')
      .getRawMany();

    const totalCount = await this.dataSource
      .getRepository(Game)
      .createQueryBuilder('g')
      .where(
        `EXISTS(
      SELECT 1 FROM "Player" p WHERE p."gameId" = g.id AND p."userId" = :userId)`,
        { userId },
      )
      .andWhere(`g.status != 'PendingSecondPlayer'`)
      .getCount();

    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: games.map((game) =>
        GameViewModelMapper.mapToViewModel(
          game,
          players.filter((p) => p.gameId === game.id),
          answers.filter((a) => a.gameId === game.id),
          questions.filter((q) => q.gameId === game.id),
        ),
      ),
    };
  }

  private async buildGameViewModel(game: RawGameData): Promise<GameViewModel> {
    const gameId = game.id;

    const questions: RawQuestionData[] = await this.dataSource
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
      .orderBy('a.addedAt', 'ASC')
      .getRawMany();

    return GameViewModelMapper.mapToViewModel(
      game,
      players,
      answers,
      questions,
    );
  }
}
