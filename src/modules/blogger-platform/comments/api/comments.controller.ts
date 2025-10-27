import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../user-accounts/guards/bearer/jwt-auth.guard';
import { JwtOptionalAuthGuard } from '../../../user-accounts/guards/bearer/jwt-optional-auth.guard';
import { GetPostCommentQuery } from '../application/queries/get-post-comment.query';
import { CurrentUserId } from '../../../../core/decorators/current-user-id';
import { CommentViewModel } from './view-models/comment-view-model';
import { CommentSetLikeCommand } from '../application/usecases/comment-set-like-use.case';
import { CommentUpdateDto } from './input-dto/comment-update.dto';
import { UpdateCommentCommand } from '../application/usecases/update-comment.usecase';
import { DeleteCommentCommand } from '../application/usecases/delete-comment.usecase';
import { LikeStatusInputDto } from '../../posts/api/input-dto/like-input.dto';

@Controller('comments')
export class CommentsController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async setCommentLike(
    @Param('id') id: string,
    @Body() dto: LikeStatusInputDto,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    await this.commandBus.execute(
      new CommentSetLikeCommand(id, dto.likeStatus, userId),
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async updateComment(
    @Param('id') id: string,
    @Body() dto: CommentUpdateDto,
    @CurrentUserId() userId: string,
  ) {
    await this.commandBus.execute(
      new UpdateCommentCommand(id, dto.content, userId),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
  ) {
    await this.commandBus.execute(new DeleteCommentCommand(id, userId));
  }

  @Get(':id')
  @UseGuards(JwtOptionalAuthGuard)
  async getComment(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
  ): Promise<CommentViewModel> {
    return this.queryBus.execute<GetPostCommentQuery, CommentViewModel>(
      new GetPostCommentQuery(id, userId),
    );
  }
}
