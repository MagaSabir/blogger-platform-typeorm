import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { clearDb } from './utils/clear-db';
import { CreatePairConnectionUseCase } from '../application/usecase/create-pair-connection.usecase';
import { GameRepository } from '../infrastructure/game.repository';
import { Game } from '../entitys/game.entity';
import { randomUUID } from 'crypto';

describe('CREATE GAME', () => {
  let app: INestApplication;
  let useCase: CreatePairConnectionUseCase;

  let repo: GameRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    useCase = app.get(CreatePairConnectionUseCase);
    repo = app.get(GameRepository);
    dataSource = app.get(DataSource);

    await clearDb(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create game', async () => {});
});
