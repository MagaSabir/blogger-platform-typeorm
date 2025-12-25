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
import { DomainException } from '../../../core/exceptions/domain.exceptions';
import {
  UpdateQuestionCommand,
  UpdateQuestionUseCase,
} from '../application/usecase/update-question.usecase';
import { clearDb } from './utils/clear-db';
import {
  GetQuestionQuery,
  GetQuestionsQueryHandler,
} from '../application/queries/get-questions.query';
import { QuestionQueryParams } from '../api/admin/input-dto/question-query-params';

describe('Question Integration', () => {
  let app: INestApplication;
  let useCase: CreateQuestionUseCase;
  let deleteUseCase: DeleteQuestionUseCase;
  let updateUseCase: UpdateQuestionUseCase;
  let getQuestionQuery: GetQuestionsQueryHandler;

  let dataSource: DataSource;
  let repo: QuestionRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dataSource = app.get(DataSource);

    await clearDb(dataSource);

    useCase = app.get(CreateQuestionUseCase);
    deleteUseCase = app.get(DeleteQuestionUseCase);
    updateUseCase = app.get(UpdateQuestionUseCase);
    getQuestionQuery = app.get(GetQuestionsQueryHandler);

    repo = app.get(QuestionRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  let questionId: string;

  it('should create question', async () => {
    const dto: CreateQuestionsInputDto = {
      body: 'test1',
      correctAnswers: ['answer1'],
    };
    const question = await useCase.execute(new CreateQuestionCommand(dto));

    questionId = question.id;

    expect(question.body).toBe('test1');
  });

  it('should delete not published question', async () => {
    const command = new DeleteQuestionCommand(questionId);
    await deleteUseCase.execute(command);

    await expect(repo.findNotPublishedQuestionById(questionId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should create question and change status', async () => {
    const dto: CreateQuestionsInputDto = {
      body: 'test1',
      correctAnswers: ['answer1'],
    };

    const question = await useCase.execute(new CreateQuestionCommand(dto));
    expect(question.published).toBe(false);

    question.publish();

    expect(question.published).toBe(true);
    // throw new Error if question status already published
    expect(() => question.publish()).toThrow(DomainException);
  });

  it('should update not published question ', async () => {
    const question = await useCase.execute(
      new CreateQuestionCommand({
        body: 'test1',
        correctAnswers: ['answer1'],
      }),
    );

    await useCase.execute(
      new UpdateQuestionCommand(question.id, {
        body: 'updated-test1',
        correctAnswers: ['updated-answer1'],
      }),
    );

    const updated = await repo.findById(question.id);
    expect(updated).toBeDefined();
  });

  it('should update quiz question', async () => {
    const dto: CreateQuestionsInputDto = {
      body: 'test1',
      correctAnswers: ['answer1'],
    };
    const updatedDto: CreateQuestionsInputDto = {
      body: 'updated-test1',
      correctAnswers: ['updated-answer1'],
    };

    const question = await useCase.execute(new CreateQuestionCommand(dto));
    await repo.save(question);

    await updateUseCase.execute(
      new UpdateQuestionCommand(question.id, updatedDto),
    );
    const queryParams = new QuestionQueryParams();

    const newQuestion = await getQuestionQuery.execute(
      new GetQuestionQuery(queryParams),
    );

    console.log(newQuestion);
  });

  it('should throw error when update pubkish qiestion', async () => {
    const dto: CreateQuestionsInputDto = {
      body: 'test1',
      correctAnswers: ['answer1'],
    };
    const updatedDto: CreateQuestionsInputDto = {
      body: 'updated-test1',
      correctAnswers: ['updated-answer1'],
    };

    const question = await useCase.execute(new CreateQuestionCommand(dto));
    question.publish();
    await repo.save(question);

    await expect(
      updateUseCase.execute(new UpdateQuestionCommand(question.id, updatedDto)),
    ).rejects.toThrow(DomainException);
  });
});
