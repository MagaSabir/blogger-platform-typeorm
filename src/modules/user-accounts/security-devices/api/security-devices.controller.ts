import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RefreshTokenGuard } from '../../guards/refresh-token/resfresh-token.guard';
import { GetRefreshToken } from '../../decorators/get-refresh-token';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetDevicesQuery } from '../queries/get-devices.query';
import { DeleteOtherActiveSessionCommand } from '../usecases/delete-other-active-session.usecase';
import { DeleteSessionCommand } from '../usecases/delete-sesion.usecase';

@UseGuards(RefreshTokenGuard)
@Controller('security')
export class SecurityDevicesController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @Get('devices')
  getDevices(@GetRefreshToken() token: string) {
    return this.queryBus.execute(new GetDevicesQuery(token));
  }

  @Delete('devices/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDeviceSession(
    @Param('id') deviceId: string,
    @GetRefreshToken() token: string,
  ) {
    await this.commandBus.execute(new DeleteSessionCommand(deviceId, token));
  }

  @Delete('devices')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOtherActiveSessions(@GetRefreshToken() token: string) {
    await this.commandBus.execute(new DeleteOtherActiveSessionCommand(token));
  }
}
