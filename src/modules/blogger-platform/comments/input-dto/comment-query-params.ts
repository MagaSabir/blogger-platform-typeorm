import { IsOptional } from 'class-validator';
import { BaseQueryParams } from '../../../../core/base-query-params.dto';

export class CommentQueryParams extends BaseQueryParams {
  @IsOptional()
  sortBy: string = 'createdAt';
}
