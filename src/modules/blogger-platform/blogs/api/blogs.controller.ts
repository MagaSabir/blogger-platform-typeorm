import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetBlogsQuery } from '../application/queries/get-blogs.query';
import { GetBlogQuery } from '../application/queries/get-blog.query';
import { BlogsQueryParams } from './input-validation-dto/blogs-query-params';
import { BlogViewModel } from '../application/queries/view-dto/blog.view-model';
import { BasePaginatedResponse } from '../../../../core/base-paginated-response';
import { GetAllPostByIdQuery } from '../application/queries/get-all-post-by-id.query';
import { PostQueryParams } from '../../posts/api/input-dto/post-query-params';
import { PostViewModel } from '../../posts/application/view-dto/post-view-model';
import { CurrentUserId } from '../../../../core/decorators/current-user-id';
import { JwtOptionalAuthGuard } from '../../../user-accounts/guards/bearer/jwt-optional-auth.guard';

@Controller('blogs')
export class BlogsController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  async getBlogs(
    @Query() query: BlogsQueryParams,
  ): Promise<BasePaginatedResponse<BlogViewModel>> {
    return await this.queryBus.execute(new GetBlogsQuery(query));
  }

  @Get(':id')
  async getBlog(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<BlogViewModel> {
    return await this.queryBus.execute(new GetBlogQuery(id));
  }

  @Get(':id/posts')
  @UseGuards(JwtOptionalAuthGuard)
  async getPostsByBlogId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PostQueryParams,
    @CurrentUserId() userId: number,
  ): Promise<BasePaginatedResponse<PostViewModel>> {
    console.log(id);
    return await this.queryBus.execute(
      new GetAllPostByIdQuery(id, query, userId),
    );
  }
}
