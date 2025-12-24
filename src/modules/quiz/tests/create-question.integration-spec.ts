import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import {
  CreateQuestionCommand,
  CreateQuestionUseCase,
} from '../application/usecase/create-question.usecase';
import { CreateQuestionsInputDto } from '../api/admin/input-dto/create-questions.input-dto';
import { DataSource } from 'typeorm';
import { Question } from '../entitys/questions.entity';

describe('createQuestion', () => {
  let app: INestApplication;
  let useCase: CreateQuestionUseCase;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    useCase = app.get(CreateQuestionUseCase);

    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    await app.init();
  });

  beforeEach(async () => {
    const entities = dataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.query(
        `TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE`,
      );
    }
  });

  it('should create question', async () => {
    const dto: CreateQuestionsInputDto = {
      body: 'test1',
      correctAnswers: ['answer1'],
    };
    let command;
    let question;
    for (let i = 0; i < 10; i++) {
      command = new CreateQuestionCommand(dto);
      question = await useCase.execute(command);
    }

    expect(question.body).toBe('test1');
    const qu = await dataSource
      .getRepository(Question)
      .createQueryBuilder()
      .orderBy('RANDOM()')
      .limit(5)
      .getRawMany();
    console.log(qu);
  });

  it('should get random questions', async () => {});
});
