import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BlogsQueryParams } from '../input-validation-dto/blogs-query-params';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';
import { GetBlogsQuery } from '../../application/queries/get-blogs.query';
import { BlogViewModel } from '../../application/queries/view-dto/blog.view-model';
import { BasicAuthGuard } from '../../../../user-accounts/guards/basic/basic-auth.guard';
import { CreateBlogInputDto } from '../input-validation-dto/create-blog-input-dto';
import { CreateBlogCommand } from '../../application/usecases/create-blog.usecase';
import { UpdateBlogCommand } from '../../application/usecases/update-blog.usecase';
import { DeleteBlogCommand } from '../../application/usecases/delete-blog.usecase';
import { CreatePostInputDto } from '../input-validation-dto/create-post-input-dto';
import { CreateBlogPostCommand } from '../../application/usecases/create-blog-post.usecase';
import { PostViewModel } from '../../../posts/application/view-dto/post-view-model';
import { UpdateBlogPostCommand } from '../../application/usecases/update-blog-post-use.case';
import { DeleteBlogPostCommand } from '../../application/usecases/delete-blog-post.usecase';
import { PostQueryParams } from '../../../posts/api/input-dto/post-query-params';
import { GetBlogPostsQuery } from '../../application/queries/get-blog-posts.query';
import { GetBlogQuery } from '../../application/queries/get-blog.query';
import { GetBlogPostQuery } from '../../application/queries/get-blog-post.query';

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
export class SaBlogsController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @Get()
  async getAllBlogs(
    @Query() query: BlogsQueryParams,
  ): Promise<BasePaginatedResponse<BlogViewModel>> {
    return this.queryBus.execute(new GetBlogsQuery(query));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() body: CreateBlogInputDto): Promise<BlogViewModel> {
    const blogId: number = await this.commandBus.execute(
      new CreateBlogCommand(body),
    );
    return this.queryBus.execute(new GetBlogQuery(blogId));
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('id', ParseIntPipe)
    id: number,
    @Body() dto: CreateBlogInputDto,
  ): Promise<void> {
    await this.commandBus.execute(new UpdateBlogCommand(dto, id));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteBlogCommand(id));
  }

  @Post(':id/posts')
  @HttpCode(HttpStatus.CREATED)
  async createPostByBlogId(
    @Param('id', ParseIntPipe)
    id: number,
    @Body() body: CreatePostInputDto,
  ): Promise<PostViewModel> {
    const postId: number = await this.commandBus.execute<
      CreateBlogPostCommand,
      number
    >(new CreateBlogPostCommand(body, id));
    //TODO вернуть созданный пост
    return this.queryBus.execute(new GetBlogPostQuery(postId));
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostByBlogId(
    @Body() body: CreatePostInputDto,
    @Param('blogId', ParseIntPipe) blogId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateBlogPostCommand(body, { blogId, postId }),
    );
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostByBlogId(
    @Param('blogId', ParseIntPipe) blogId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<void> {
    await this.commandBus.execute(
      new DeleteBlogPostCommand({ blogId, postId }),
    );
  }

  @Get(':id/posts')
  async getBlogPost(
    @Query() query: PostQueryParams,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BasePaginatedResponse<PostViewModel>> {
    return this.queryBus.execute(new GetBlogPostsQuery(query, id));
  }
}
