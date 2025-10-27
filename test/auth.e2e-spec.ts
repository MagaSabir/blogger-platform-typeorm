import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { App } from 'supertest/types';
import request from 'supertest';
import * as process from 'node:process';
import { DataSource } from 'typeorm';
import { EmailService } from '../src/modules/notification/email.service';

describe('AUTH', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  const basicAuthCredentials = 'admin:qwerty';
  const base64Credentials =
    Buffer.from(basicAuthCredentials).toString('base64');

  let confirmationCode;

  beforeAll(async () => {
    process.env.NODE_ENV = 'testing';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService) // <-- мок
      .useValue({
        sendConfirmationEmail: jest
          .fn()
          .mockImplementation(async (email, code) => {
            console.log('📩 Mock send email:', { email, code });
            return true;
          }),
      })
      .compile();

    dataSource = moduleFixture.get<DataSource>(DataSource);

    dataSource.query(`TRUNCATE TABLE "Sessions"`);
    dataSource.query(`TRUNCATE TABLE "Users" RESTART IDENTITY CASCADE
`);

    app = moduleFixture.createNestApplication();
    app.getHttpAdapter().getInstance().set('trust proxy', true);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('SESSIONS', () => {
    let token: string;

    it('should createUser', async () => {
      const user = await request(app.getHttpServer())
        .post('/sa/users')
        .set('Authorization', `Basic ${base64Credentials}`)
        .send({
          login: `user1`,
          password: 'string',
          email: `user1@example.com`,
        })
        .expect(201);
    });
    it('should get token after login', async () => {
      const result = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ loginOrEmail: 'user1', password: 'string' })
        .expect(200);
      token = result.body.accessToken;
    });

    it('should add session', async () => {
      const result = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(result.body).toBeDefined();
    });
  });

  describe('Registration and confirmation', () => {
    it('POST /auth/registration → should register user', async () => {
      await request(app.getHttpServer())
        .post('/auth/registration')
        .send({
          email: 'testuser@mail.com',
          login: 'testE2E',
          password: '123456',
        })
        .expect(204);

      // Берём confirmationCode напрямую из базы
      const user = await dataSource.query(
        `SELECT "confirmationCode" FROM "Users" WHERE login = $1`,
        ['testE2E'],
      );
      confirmationCode = user[0].confirmationCode;
      expect(confirmationCode).toBeDefined();
    });

    it('POST /auth/registration-confirmation → should confirm email', async () => {
      await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({
          code: confirmationCode,
        })
        .expect(204);
    });

    it('POST /auth/login → should login after confirmation', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          loginOrEmail: 'testE2E',
          password: '123456',
        })
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
    });
  });
});
