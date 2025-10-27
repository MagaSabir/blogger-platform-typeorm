import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/usecase/admins/create-user.usecase';
import { UserViewModel } from './view-dto/user-view-model';
import { DeleteUserCommand } from '../application/usecase/admins/delete-user.usecase';
import { CreateUserInputDto } from './input-dto/create-user.input-dto';
import { BasicAuthGuard } from '../../guards/basic/basic-auth.guard';
import { UsersQueryParams } from './input-dto/users-query-params';
import { GetAllUsersQuery } from '../application/queries/get-all-users.query';
import {
  ApiBasicAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserSwaggerDecorator } from './swagger/create-user.swagger-decorator';
import { DeleteUserSwaggerDecorator } from './swagger/delete-user.swagger-decorator';
import { ApiPaginationResponseDecorator } from './swagger/api-pagination-response.decorator';
import { BasePaginatedResponse } from '../../../../core/base-paginated-response';
import { GetUsersSwaggerDecorator } from './swagger/get-users.swagger.decorator';

@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBasicAuth('basic')
@ApiTags('Users')
@Controller('sa/users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  @CreateUserSwaggerDecorator()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUserInputDto): Promise<UserViewModel> {
    return this.commandBus.execute(new CreateUserCommand(dto));
  }

  @DeleteUserSwaggerDecorator()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteUserCommand(id));
  }

  @ApiPaginationResponseDecorator(UserViewModel)
  @GetUsersSwaggerDecorator()
  @Get()
  async getUsers(
    @Query() query: UsersQueryParams,
  ): Promise<BasePaginatedResponse<UserViewModel>> {
    return this.queryBus.execute(new GetAllUsersQuery(query));
  }
}
