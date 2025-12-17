import { BaseQueryParams } from '../../../../../core/base-query-params.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

enum PublishedStatus {
  ALL = 'all',
  PUBLISHED = 'published',
  NOT_PUBLISHED = 'notPublished',
}

export class QuestionQueryParams extends BaseQueryParams {
  @IsString()
  @IsOptional()
  sortBy: string = 'createdAt';
  @IsOptional()
  @IsOptional()
  bodySearchTerm: string | null = null;
  @IsEnum(PublishedStatus)
  @IsOptional()
  publishedStatus: PublishedStatus = PublishedStatus.ALL;
}
