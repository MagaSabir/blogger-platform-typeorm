import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import process from 'node:process';
import { INestApplication } from '@nestjs/common';
describe('AppModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.NODE_ENV = 'testing';

    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('PORT:', process.env.PORT);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: process.env.NODE_ENV,
          isGlobal: true,
        }),
        AppModule,
      ],
    }).compile();
    console.log('LOGIN2:', process.env.LOGIN2);

    app = moduleFixture.createNestApplication();

    await app.init();
  }, 30000);

  it('should load env vars from .env.test', () => {
    expect(process.env.LOGIN).toBe('admin');
  });
});
