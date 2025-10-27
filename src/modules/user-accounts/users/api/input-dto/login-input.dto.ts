import { ApiProperty } from '@nestjs/swagger';

export class LoginInputDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User login or email',
  })
  loginOrEmail: string;

  @ApiProperty({ example: 'password', description: 'User password' })
  password: string;
}
