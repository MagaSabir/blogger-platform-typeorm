import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UsersQueryParams } from './input-dto/users-query-params';

describe('UsersController', () => {
  let controller: UsersController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call queryBus.execute on getUsers', async () => {
    const queryParams = {} as any;

    (queryBus.execute as jest.Mock).mockResolvedValue([
      { id: 1, login: 'Mmmm' },
    ]);
    const result = await controller.getUsers(queryParams);
    expect(result).toEqual([{ id: 1, login: 'Mmmm' }]);
    expect(queryBus.execute as jest.Mock).toHaveBeenCalled();
  });
});
