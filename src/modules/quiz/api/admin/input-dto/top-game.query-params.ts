import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class TopGameQueryParams {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageNumber: number = 1;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize: number = 10;

  calculateSkip(): number {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
