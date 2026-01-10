import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import {
  CreatePairConnectionCommand,
  CreatePairConnectionUseCase,
} from '../application/usecase/create-pair-connection.usecase';
import { GameStatus } from '../entitys/game.entity';
import {
  CreateUserCommand,
  CreateUserUseCase,
} from '../../user-accounts/users/application/usecase/admins/create-user.usecase';
import {
  GetGameQuery,
  GetGameQueryHandler,
} from '../application/queries/get-game-query';
import {
  CreateQuestionCommand,
  CreateQuestionUseCase,
} from '../application/usecase/create-question.usecase';
import { Question } from '../entitys/questions.entity';
import {
  AnswerCommand,
  AnswerUseCase,
} from '../application/usecase/answer.usecase';
import {
  GetGamePairQuery,
  GetGamePairQueryHandler,
} from '../application/queries/get-game-pair.query';
import {
  GetGameByIdQuery,
  GetGameQueryByIdHandler,
} from '../application/queries/get-game-by-id.query';
import {
  GetStatisticQuery,
  GetStatisticQueryHandler,
} from '../application/queries/get-statistic.query';
import { StatisticViewModel } from '../api/view-models/statistic.view-model';
import {
  GetMyGamesQuery,
  GetMyGamesQueryHandler,
} from '../application/queries/get-my-games.query';
import { GameQueryParams } from '../api/admin/input-dto/game.query-params';

const user1 = {
  login: 'test123',
  password: 'string',
  email: 'example@example.com',
};
const user2 = {
  login: 'test2',
  password: 'string',
  email: 'example1242@example2.com',
};

describe('CREATE GAME', () => {
  let app: INestApplication;
  let useCase: CreatePairConnectionUseCase;
  let createUserUseCase: CreateUserUseCase;
  let getGameQueryHandler: GetGameQueryHandler;
  let getGameByIdQueryHandler: GetGameQueryByIdHandler;
  let createQuestionUseCase: CreateQuestionUseCase;
  let answerUseCase: AnswerUseCase;
  let getGamePairQueryHandler: GetGamePairQueryHandler;
  let dataSource: DataSource;
  let getStatistic: GetStatisticQueryHandler;
  let getMyGamesQueryHandler: GetMyGamesQueryHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    useCase = app.get(CreatePairConnectionUseCase);
    createUserUseCase = app.get(CreateUserUseCase);
    getGameQueryHandler = app.get(GetGameQueryHandler);
    dataSource = app.get(DataSource);
    createQuestionUseCase = app.get(CreateQuestionUseCase);
    answerUseCase = app.get(AnswerUseCase);
    getGamePairQueryHandler = app.get(GetGamePairQueryHandler);
    getStatistic = app.get(GetStatisticQueryHandler);
    getGameByIdQueryHandler = app.get(GetGameQueryByIdHandler);
    getMyGamesQueryHandler = app.get(GetMyGamesQueryHandler);
  });

  afterEach(async () => {
    await dataSource.query('TRUNCATE TABLE "Game" CASCADE');
    await dataSource.query('TRUNCATE TABLE "Player" CASCADE');
    await dataSource.query('TRUNCATE TABLE "GameQuestion" CASCADE');
    await dataSource.query('TRUNCATE TABLE "Question" CASCADE');
    await dataSource.query('TRUNCATE TABLE "Users" CASCADE');
    await dataSource.query('TRUNCATE TABLE "Answers" CASCADE');
  });
  afterAll(async () => {
    await app.close();
  });

  it('should create game with two players', async () => {
    const userId = await createUserUseCase.execute(
      new CreateUserCommand(user1),
    );
    const userId2 = await createUserUseCase.execute(
      new CreateUserCommand(user2),
    );

    const questions: Question[] = [];
    for (let i = 0; i < 5; i++) {
      const dto = {
        body: `question${i}`,
        correctAnswers: [`answer${i}`],
      };
      const question = await createQuestionUseCase.execute(
        new CreateQuestionCommand(dto),
      );
      question.publish();
      await dataSource.getRepository(Question).save(question);
      questions.push(question);
    }

    await useCase.execute(new CreatePairConnectionCommand(userId));

    const gameId: string = await useCase.execute(
      new CreatePairConnectionCommand(userId2),
    );

    for (let i = 0; i < 5; i++) {
      const answerDto1 = { answer: `answer${i}` };

      await answerUseCase.execute(new AnswerCommand(userId, answerDto1));

      const answerDto2 = {
        answer: i % 2 === 0 ? `answer${i}` : `wrong${i}`,
      };

      await answerUseCase.execute(new AnswerCommand(userId2, answerDto2));
    }

    const game = await getGameQueryHandler.execute(new GetGameQuery(gameId));

    expect(game?.status).toBe(GameStatus.FINISHED);
    expect(game?.firstPlayerProgress?.player.id).toBe(userId);
    expect(game?.secondPlayerProgress?.player.id).toBe(userId2);
  });

  it('should create,connect games, add answers', async () => {
    const userId = await createUserUseCase.execute(
      new CreateUserCommand(user1),
    );
    const userId2 = await createUserUseCase.execute(
      new CreateUserCommand(user2),
    );

    const questions: Question[] = [];
    for (let i = 0; i < 5; i++) {
      const dto = {
        body: `question${i}`,
        correctAnswers: [`answer${i}`],
      };
      const question = await createQuestionUseCase.execute(
        new CreateQuestionCommand(dto),
      );
      question.publish();
      await dataSource.getRepository(Question).save(question);
      questions.push(question);
    }

    await useCase.execute(new CreatePairConnectionCommand(userId));
    await useCase.execute(new CreatePairConnectionCommand(userId2));
    const game1 = await getGamePairQueryHandler.execute(
      new GetGamePairQuery(userId),
    );

    expect(game1?.status).toBe(GameStatus.ACTIVE);

    // 1. ✓
    await answerUseCase.execute(
      new AnswerCommand(userId, { answer: 'answer0' }),
    );
    // 2. ✓
    await answerUseCase.execute(
      new AnswerCommand(userId, { answer: 'answer1' }),
    );

    const gameUser1 = await getGamePairQueryHandler.execute(
      new GetGamePairQuery(userId),
    );
    const gameUser2 = await getGamePairQueryHandler.execute(
      new GetGamePairQuery(userId2),
    );
    expect(gameUser1?.status).toBe(GameStatus.ACTIVE);
    expect(gameUser2?.status).toBe(GameStatus.ACTIVE);
  });

  it('should get user statistic', async () => {
    const userId = await createUserUseCase.execute(
      new CreateUserCommand(user1),
    );
    const userId2 = await createUserUseCase.execute(
      new CreateUserCommand(user2),
    );

    const questions: Question[] = [];
    for (let i = 0; i < 5; i++) {
      const dto = {
        body: `question${i}`,
        correctAnswers: [`answer`],
      };
      const question = await createQuestionUseCase.execute(
        new CreateQuestionCommand(dto),
      );
      question.publish();
      await dataSource.getRepository(Question).save(question);
      questions.push(question);
    }

    await useCase.execute(new CreatePairConnectionCommand(userId));
    const gameId: string = await useCase.execute(
      new CreatePairConnectionCommand(userId2),
    );
    const game = await getGamePairQueryHandler.execute(
      new GetGamePairQuery(userId2),
    );

    expect(game?.status).toBe(GameStatus.ACTIVE);

    for (let i = 0; i < 5; i++) {
      await answerUseCase.execute(
        new AnswerCommand(userId, { answer: `answer` }),
      );
      await answerUseCase.execute(
        new AnswerCommand(userId2, { answer: `answer` }),
      );
    }
    const game2 = await getGameByIdQueryHandler.execute(
      new GetGameByIdQuery(gameId, userId),
    );
    expect(game2?.status).toBe(GameStatus.FINISHED);
    expect(game2?.firstPlayerProgress?.score).toBe(6);

    const statistic = await getStatistic.execute(new GetStatisticQuery(userId));
    expect(statistic.sumScore).toBe(6);
    expect(statistic.avgScores).toBe(6);
    expect(statistic.gamesCount).toBe(1);
    expect(statistic.winsCount).toBe(1);
    expect(statistic.lossesCount).toBe(0);
    expect(statistic.drawsCount).toBe(0);

    const questions2: Question[] = [];
    for (let i = 0; i < 5; i++) {
      const dto = {
        body: `question${i}`,
        correctAnswers: [`answer`],
      };
      const question2 = await createQuestionUseCase.execute(
        new CreateQuestionCommand(dto),
      );
      question2.publish();
      await dataSource.getRepository(Question).save(question2);
      questions2.push(question2);
    }

    await useCase.execute(new CreatePairConnectionCommand(userId));
    await useCase.execute(new CreatePairConnectionCommand(userId2));
    await getGamePairQueryHandler.execute(new GetGamePairQuery(userId2));

    for (let i = 0; i < 5; i++) {
      await answerUseCase.execute(
        new AnswerCommand(userId, { answer: `answer` }),
      );
      await answerUseCase.execute(
        new AnswerCommand(userId2, { answer: `answer` }),
      );
    }
    const game3 = await getGameByIdQueryHandler.execute(
      new GetGameByIdQuery(gameId, userId),
    );

    expect(game3?.status).toBe(GameStatus.FINISHED);
    expect(game3?.firstPlayerProgress?.score).toBe(6);

    const statistic2 = await getStatistic.execute(
      new GetStatisticQuery(userId2),
    );
    expect(statistic2.sumScore).toBe(10);
    expect(statistic2.avgScores).toBe(5);
    expect(statistic2.gamesCount).toBe(2);
    expect(statistic2.winsCount).toBe(0);
    expect(statistic2.lossesCount).toBe(2);
    expect(statistic2.drawsCount).toBe(0);

    const query = new GameQueryParams();

    const allGames = await getMyGamesQueryHandler.execute(
      new GetMyGamesQuery(userId, query),
    );
  });

  it('should get my games', async () => {
    const userId = await createUserUseCase.execute(
      new CreateUserCommand(user1),
    );
    const userId2 = await createUserUseCase.execute(
      new CreateUserCommand(user2),
    );
    const questions: Question[] = [];
    for (let i = 0; i < 5; i++) {
      const dto = {
        body: `question${i}`,
        correctAnswers: [`answer${i}`],
      };
      const question = await createQuestionUseCase.execute(
        new CreateQuestionCommand(dto),
      );
      question.publish();
      await dataSource.getRepository(Question).save(question);
      questions.push(question);
    }
    for (let gameNumber = 0; gameNumber < 3; gameNumber++) {
      console.log(`Создание игры ${gameNumber + 1}`);
      await useCase.execute(new CreatePairConnectionCommand(userId));
      await useCase.execute(new CreatePairConnectionCommand(userId2));
      for (let questionIndex = 0; questionIndex < 5; questionIndex++) {
        // Игрок 1 отвечает
        await answerUseCase.execute(
          new AnswerCommand(userId, { answer: `answer${questionIndex}` }),
        );
        await answerUseCase.execute(
          new AnswerCommand(userId2, { answer: `answer${questionIndex}` }),
        );
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      console.log(`Игра ${gameNumber + 1} завершена`);
    }
    await useCase.execute(new CreatePairConnectionCommand(userId));
    await useCase.execute(new CreatePairConnectionCommand(userId2));
    const query = new GameQueryParams();

    const allGames = await getMyGamesQueryHandler.execute(
      new GetMyGamesQuery(userId, query),
    );

    console.log(allGames);
  });
});
