import { ForbiddenException, INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import {
  CreatePairConnectionCommand,
  CreatePairConnectionUseCase,
} from '../application/usecase/create-pair-connection.usecase';
import { Game, GameStatus } from '../entitys/game.entity';
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
  GetAnswerQuery,
  GetAnswerQueryHandler,
} from '../application/queries/get-answer.query';
import { Player } from '../entitys/player.entity';
import { randomUUID } from 'crypto';
import {
  GetGamePairQuery,
  GetGamePairQueryHandler,
} from '../application/queries/get-game-pair.query';
import {
  GetGameByIdQuery,
  GetGameQueryByIdHandler,
} from '../application/queries/get-game-by-id.query';

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
  let createQuestionUseCase: CreateQuestionUseCase;
  let answerUseCase: AnswerUseCase;
  let answerQuery: GetAnswerQueryHandler;
  let getGamePairQueryHandler: GetGamePairQueryHandler;
  let dataSource: DataSource;
  let getGameQueryByIdHandler: GetGameQueryByIdHandler;

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
    answerQuery = app.get(GetAnswerQueryHandler);
    getGamePairQueryHandler = app.get(GetGamePairQueryHandler);
    getGameQueryByIdHandler = app.get(GetGameQueryByIdHandler);
  });

  afterEach(async () => {
    await dataSource.query('TRUNCATE TABLE "Game" CASCADE');
    await dataSource.query('TRUNCATE TABLE "Player" CASCADE');
    await dataSource.query('TRUNCATE TABLE "GameQuestion" CASCADE');
    await dataSource.query('TRUNCATE TABLE "Question" CASCADE');
    await dataSource.query('TRUNCATE TABLE "Users" CASCADE');
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
    const gameId = await useCase.execute(
      new CreatePairConnectionCommand(userId2),
    );
    const game1 = await getGamePairQueryHandler.execute(
      new GetGamePairQuery(userId),
    );

    expect(game1?.status).toBe(GameStatus.ACTIVE);

    await expect(
      getGamePairQueryHandler.execute(new GetGamePairQuery(userId)),
    ).rejects.toThrow(ForbiddenException);

    const answerDto1 = { answer: `answer0` };
    const answerDto2 = { answer: `incorrect` };
    await answerUseCase.execute(new AnswerCommand(userId, answerDto1));
    await answerUseCase.execute(new AnswerCommand(userId2, answerDto2));
    const answerId = await answerUseCase.execute(
      new AnswerCommand(userId2, answerDto1),
    );

    const answer = await answerQuery.execute(new GetAnswerQuery(answerId));
    expect(new Date(answer!.addedAt).toString()).not.toBe('Invalid Date');

    const gameUser1 = await getGamePairQueryHandler.execute(
      new GetGamePairQuery(userId),
    );
    const gameUser2 = await getGamePairQueryHandler.execute(
      new GetGamePairQuery(userId2),
    );
    expect(gameUser1?.status).toBe(GameStatus.ACTIVE);
    expect(gameUser2?.status).toBe(GameStatus.ACTIVE);
  });
});
