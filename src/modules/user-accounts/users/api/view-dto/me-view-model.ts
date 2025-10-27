import { ApiProperty } from '@nestjs/swagger';

export class MeViewModel {
  @ApiProperty({
    type: 'string',
    example: 'example@gmail.com',
    description: 'email',
  })
  email: string;
  @ApiProperty({
    type: 'string',
    example: 'login',
    description: 'login',
  })
  login: string;
  @ApiProperty({
    type: 'string',
    example: 'password123',
    description: 'password',
  })
  password: string;
}
