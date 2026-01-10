import { IsOptional } from 'class-validator';
import { BaseQueryParams } from '../../../../../core/base-query-params.dto';

export class GameQueryParams extends BaseQueryParams {
  @IsOptional()
  sortBy: string = 'pairCreatedDate';
}
