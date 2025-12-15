import { INestApplication, NotFoundException } from '@nestjs/common';
import {
  CreateQuestionCommand,
  CreateQuestionUseCase,
} from '../application/usecase/create-question.usecase';
import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import {
  DeleteQuestionCommand,
  DeleteQuestionUseCase,
} from '../application/usecase/delete-question.usecase';
import { QuestionRepository } from '../infrastructure/question.repository';
import { CreateQuestionsInputDto } from '../api/admin/input-dto/create-questions.input-dto';

describe('Question Integration', () => {
  let app: INestApplication;
  let useCase: CreateQuestionUseCase;
  let deleteUseCase: DeleteQuestionUseCase;
  let dataSource: DataSource;
  let repo: QuestionRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    useCase = app.get(CreateQuestionUseCase);
    deleteUseCase = app.get(DeleteQuestionUseCase);

    dataSource = app.get(DataSource);

    repo = app.get(QuestionRepository);
  });

  afterAll(async () => {
    await app.close();

    const entities = dataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.query(
        `TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE`,
      );
    }
  });

  let questionId: string;

  it('should create question', async () => {
    const dto: CreateQuestionsInputDto = {
      body: 'test1',
      correctAnswers: ['answer1'],
    };
    const command = new CreateQuestionCommand(dto);
    const question = await useCase.execute(command);

    questionId = question.id;

    expect(question.body).toBe('test1');
  });

  it('should delete not published question', async () => {
    const command = new DeleteQuestionCommand(questionId);
    await deleteUseCase.execute(command);

    await expect(repo.findNoPublishedQuestionById(questionId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
