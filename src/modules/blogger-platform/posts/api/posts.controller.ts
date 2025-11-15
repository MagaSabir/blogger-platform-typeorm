import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PostQueryParams } from './input-dto/post-query-params';
import { GetAllPostsQuery } from '../application/queries/get-all-posts.query';
import { BasePaginatedResponse } from '../../../../core/base-paginated-response';
import { PostViewModel } from '../application/view-dto/post-view-model';
import { GetPostQuery } from '../application/queries/get-post.query';
import { CurrentUserId } from '../../../../core/decorators/current-user-id';
import { JwtOptionalAuthGuard } from '../../../user-accounts/guards/bearer/jwt-optional-auth.guard';
import { JwtAuthGuard } from '../../../user-accounts/guards/bearer/jwt-auth.guard';
import { PostCommentInputDto } from './input-dto/post-comment.input.dto';
import { CreateCommentCommand } from '../application/usecases/create-comment.usecase';
import { GetPostCommentQuery } from '../../comments/application/queries/get-post-comment.query';
import { LikeStatusInputDto } from './input-dto/like-input.dto';
import { PostSetLikeCommand } from '../application/usecases/post.set-like.usecase';
import { CommentViewModel } from '../../comments/api/view-models/comment-view-model';
import { GetPostCommentsQuery } from '../application/queries/get-post-comments.query';
import { CommentQueryParams } from '../../comments/input-dto/comment-query-params';

@Controller('posts')
export class PostsController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @Get()
  @UseGuards(JwtOptionalAuthGuard)
  async getPosts(
    @Query() query: PostQueryParams,
    @CurrentUserId() userId: number,
  ): Promise<BasePaginatedResponse<PostViewModel[]>> {
    return this.queryBus.execute(new GetAllPostsQuery(query, userId));
  }

  @Get(':id')
  @UseGuards(JwtOptionalAuthGuard)
  async getPost(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserId() userId: number,
  ): Promise<PostViewModel> {
    return this.queryBus.execute(new GetPostQuery(id, userId));
  }

  @Get(':id/comments')
  @UseGuards(JwtOptionalAuthGuard)
  async getPostComments(
    @Query() query: CommentQueryParams,
    @CurrentUserId() userId: string,
    @Param('id') id: string,
  ): Promise<CommentViewModel> {
    return this.queryBus.execute(new GetPostCommentsQuery(userId, id, query));
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PostCommentInputDto,
    @CurrentUserId() userId: number,
  ): Promise<CommentViewModel> {
    return this.commandBus.execute<GetPostCommentQuery, CommentViewModel>(
      new CreateCommentCommand(id, dto, userId),
    );
  }

  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async setPostLike(
    @Param('id') id: number,
    @Body() dto: LikeStatusInputDto,
    @CurrentUserId() userId: number,
  ) {
    await this.commandBus.execute(
      new PostSetLikeCommand(id, dto.likeStatus, userId),
    );
  }
}
