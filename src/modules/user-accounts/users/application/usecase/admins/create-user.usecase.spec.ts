import { CreateUserCommand, CreateUserUseCase } from './create-user.usecase';
import { PasswordService } from '../../services/password.service';
import { UsersRepository } from '../../../infrastructure/users.repository';
import { UsersConfig } from '../../../../config/users.config';
import { BadRequestException } from '@nestjs/common';

describe('Create user useCase', () => {
  let useCase: CreateUserUseCase;
  let usersRepository: jest.Mocked<UsersRepository>;
  let passwordService: jest.Mocked<PasswordService>;
  let userConfig: UsersConfig;

  beforeEach(() => {
    passwordService = { hash: jest.fn().mockResolvedValue('hashed') } as any;

    usersRepository = {
      findUserByLoginOrEmail: jest.fn(),
      createUser: jest.fn(),
    } as Partial<UsersRepository> as any;

    userConfig = {
      isAutoConfirmed: true,
    } as UsersConfig;

    useCase = new CreateUserUseCase(
      usersRepository,
      passwordService,
      userConfig,
    );
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should create a new user successfully', async () => {
    const dto = {
      login: 'Test1',
      email: 'example@mail.com',
      password: 'string',
    };

    (usersRepository.findUserByLoginOrEmail as jest.Mock).mockResolvedValue(
      null,
    );
    (passwordService.hash as jest.Mock).mockResolvedValue('hashedPassword');
    (usersRepository.createUser as jest.Mock).mockResolvedValue({
      id: '1',
      login: dto.login,
      email: dto.email,
      isConfirmed: true,
    });

    const result = await useCase.execute(new CreateUserCommand(dto));

    expect(result).toEqual({
      id: '1',
      login: dto.login,
      email: dto.email,
      isConfirmed: true,
    });

    expect(usersRepository.findUserByLoginOrEmail).toHaveBeenCalledWith(
      dto.login,
      dto.email,
    );
    expect(passwordService.hash).toHaveBeenCalledWith(dto.password);
    expect(usersRepository.createUser).toHaveBeenCalledWith({
      login: dto.login,
      email: dto.email,
      passwordHash: 'hashedPassword',
      isConfirmed: true,
    });
  });

  it('should throw badRequestException if user already exists', async () => {
    const dto = { login: 'Mmm', email: 'exemple@mail.com', password: 'string' };

    (usersRepository.findUserByLoginOrEmail as jest.Mock).mockResolvedValue({
      id: '1',
      login: dto.login,
      email: dto.email,
    });

    await expect(useCase.execute(new CreateUserCommand(dto))).rejects.toThrow(
      BadRequestException,
    );
  });
});
