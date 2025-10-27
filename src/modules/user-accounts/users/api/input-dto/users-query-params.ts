import { BaseQueryParams } from '../../../../../core/base-query-params.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UsersQueryParams extends BaseQueryParams {
  @IsOptional()
  @ApiProperty({ required: false, default: 'createdAt' })
  sortBy: string = 'createdAt';
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: null,
    type: String,

    description:
      'Search term for user Login: Login should contains this term in any position',
  })
  searchEmailTerm: string | null = null;
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: String,
    default: null,

    description:
      'Search term for user Email: Email should contains this term in any position',
  })
  searchLoginTerm: string | null = null;
}
