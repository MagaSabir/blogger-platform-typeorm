import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { clearDb } from './utils/clear-db';
import {
  CreatePairConnectionCommand,
  CreatePairConnectionUseCase,
} from '../application/usecase/create-pair-connection.usecase';
import { GameRepository } from '../infrastructure/game.repository';
import { Game } from '../entitys/game.entity';
import { randomUUID } from 'crypto';
import {
  CreateUserCommand,
  CreateUserUseCase,
} from '../../user-accounts/users/application/usecase/admins/create-user.usecase';
import {
  GetGameQuery,
  GetGameQueryHandler,
} from '../application/queries/get-game-query';

describe('CREATE GAME', () => {
  let app: INestApplication;
  let useCase: CreatePairConnectionUseCase;
  let createUserUseCase: CreateUserUseCase;
  let getGameQueryHandler: GetGameQueryHandler;

  let repo: GameRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    useCase = app.get(CreatePairConnectionUseCase);
    createUserUseCase = app.get(CreateUserUseCase);
    getGameQueryHandler = app.get(GetGameQueryHandler);
    repo = app.get(GameRepository);
    dataSource = app.get(DataSource);

    await clearDb(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create game', async () => {
    const dto = {
      login: 'test1',
      password: 'string',
      email: 'example@example.com',
    };

    const userId = await createUserUseCase.execute(new CreateUserCommand(dto));
    const gameId: string = await useCase.execute(
      new CreatePairConnectionCommand(userId),
    );
    const game = await getGameQueryHandler.execute(new GetGameQuery(gameId));
    expect(game?.status).toBe('Pending');
    expect(game?.firstPlayerProgress).toBeDefined();
    console.log(game);
  });
});
