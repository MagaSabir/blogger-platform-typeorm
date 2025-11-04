import { DeleteUserCommand, DeleteUserUseCase } from './delete-user.usecase';
import { NotFoundException } from '@nestjs/common';

describe('Delete user use case', () => {
  let useCase: DeleteUserUseCase;
  let usersRepository: any;

  beforeEach(() => {
    usersRepository = {
      findUserOrThrowNotFound: jest.fn(),
      deleteUserById: jest.fn(),
    } as any;

    useCase = new DeleteUserUseCase(usersRepository);
  });

  it('should delete user by id', async () => {
    usersRepository.findUserOrThrowNotFound.mockResolvedValue({
      id: 1,
    });

    await useCase.execute(new DeleteUserCommand(1));

    expect(usersRepository.deleteUserById).toHaveBeenCalledWith(1);
  });
  it('should throw if user not exists', async () => {
    usersRepository.findUserOrThrowNotFound.mockRejectedValue(
      new NotFoundException(),
    );

    await expect(useCase.execute(new DeleteUserCommand(1))).rejects.toThrow();
  });
});
