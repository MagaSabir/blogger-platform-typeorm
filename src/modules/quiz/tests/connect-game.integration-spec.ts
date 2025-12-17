import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { clearDb } from './utils/clear-db';

describe('CREATE GAME', () => {
  let app: INestApplication;

  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dataSource = app.get(DataSource);

    await clearDb(dataSource);
  });
});
