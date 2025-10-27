import { ApiProperty } from '@nestjs/swagger';

export class UserViewModel {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID пользователя',
  })
  id: string;

  @ApiProperty({ example: 'john_doe', description: 'Логин пользователя' })
  login: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email пользователя',
  })
  email: string;

  @ApiProperty({
    example: '2025-10-20T12:00:00Z',
    description: 'Дата создания',
  })
  createdAt: string;
}
