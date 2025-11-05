import {
  RegistrationUserCommand,
  RegistrationUserUseCase,
} from './registration-user.usecase';
import { UsersRepository } from '../../infrastructure/users.repository';
import { PasswordService } from '../services/password.service';
import { EmailService } from '../../../../notification/email.service';
import { BadRequestException } from '@nestjs/common';

describe('register user', () => {
  let useCase: RegistrationUserUseCase;
  let usersRepository: jest.Mocked<UsersRepository>;
  let passwordService: jest.Mocked<PasswordService>;
  let mailService: jest.Mocked<EmailService>;

  beforeEach(() => {
    passwordService = { hash: jest.fn().mockResolvedValue('hashed') } as any;

    usersRepository = {
      findUserByLoginOrEmail: jest.fn(),
      save: jest.fn(),
    } as any;

    mailService = { sendConfirmationEmail: jest.fn() } as any;

    useCase = new RegistrationUserUseCase(
      passwordService,
      usersRepository,
      mailService,
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should register new user', async () => {
    const dto = {
      login: 'test',
      password: 'password',
      email: 'example@mail.com',
    };

    (usersRepository.findUserByLoginOrEmail as jest.Mock).mockResolvedValue(
      null,
    );
    (usersRepository.save as jest.Mock).mockResolvedValue({
      id: '1',
      login: dto.login,
      email: dto.email,
    });
    const command = new RegistrationUserCommand(dto);
    const result = await useCase.execute(command);

    expect(usersRepository.findUserByLoginOrEmail).toHaveBeenCalledWith(
      dto.login,
      dto.email,
    );

    expect(passwordService.hash).toHaveBeenCalledWith(dto.password);

    expect(usersRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        login: dto.login,
        email: dto.email,
        passwordHash: 'hashed',
      }),
    );
    expect(mailService.sendConfirmationEmail).toHaveBeenCalledWith(
      dto.email,
      expect.any(String),
    );

    expect(result).toBe('1');
  });

  it('should throw error if login already exists', async () => {
    const dto = {
      login: 'test1',
      email: 'test@mail.com',
      password: 'hash',
    };

    usersRepository.findUserByLoginOrEmail.mockResolvedValue({
      login: 'test1',
      email: 'test@mail.com',
    } as any);

    await expect(
      useCase.execute(new RegistrationUserCommand(dto)),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw error if email already exists', async () => {
    const dto = {
      login: 'test',
      email: 'test1@mail.com',
      password: 'hash',
    };

    usersRepository.findUserByLoginOrEmail.mockResolvedValue({
      login: 'newUser',
      email: 'test1@mail.com',
    } as any);

    await expect(
      useCase.execute(new RegistrationUserCommand(dto)),
    ).rejects.toThrow(BadRequestException);
  });
});
