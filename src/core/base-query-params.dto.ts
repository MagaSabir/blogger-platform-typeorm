import { Type } from 'class-transformer';
import { IsIn, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseQueryParams {
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ required: false, default: 1 })
  pageNumber: number = 1;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    required: false,
    default: 10,
  })
  pageSize: number = 10;

  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  @ApiPropertyOptional({
    description: 'Sorting direction',
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  sortDirection: SortDirection = 'DESC';

  calculateSkip(): number {
    return (this.pageNumber - 1) * this.pageSize;
  }
}

export type SortDirection = 'ASC' | 'DESC';
