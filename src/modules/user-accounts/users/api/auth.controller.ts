import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { LocalAuthGuard } from '../../guards/local/local.auth.guard';
import { CurrentUserId } from '../../../../core/decorators/current-user-id';
import { Request, Response } from 'express';
import { LoginUserCommand } from '../application/usecase/login-user.usecase';
import { JwtAuthGuard } from '../../guards/bearer/jwt-auth.guard';
import { GetUserQuery } from '../application/queries/get-user.query';
import { UserViewModel } from './view-dto/user-view-model';
import { InputCodeValidation } from './input-dto/input-code-validation';
import { RegistrationConfirmationCommand } from '../application/usecase/registration-confirmation.usecase';
import { InputEmailValidation } from './input-dto/input-email-validation';
import { ResendConfirmationEmailCommand } from '../application/usecase/resend-confirmation-email.usecase';
import { PasswordRecoveryCommand } from '../application/usecase/password-recovery.usecase';
import { NewPasswordCommand } from '../application/usecase/new-password.usecase';
import { InputNewPasswordDto } from './input-dto/input-password-validation';
import { RefreshTokenGuard } from '../../guards/refresh-token/resfresh-token.guard';
import { RefreshTokenCommand } from '../application/usecase/refresh-token.usecase';
import { GetRefreshToken } from '../../decorators/get-refresh-token';
import { LogoutCommand } from '../application/usecase/logout.usecase';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { LoginInputDto } from './input-dto/login-input.dto';
import { LoginViewModel } from './view-dto/login-view-model';
import { ErrorViewModel } from '../../../../core/view-dto/error-view-model';
import { MeViewModel } from './view-dto/me-view-model';
import { CreateUserInputDto } from './input-dto/create-user.input-dto';
import { RegistrationUserCommand } from '../application/usecase/registration-user.usecase';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post('registration')
  @ApiOperation({
    summary:
      'Registration in the system. Email with confirmation code will be send to passed email address',
  })
  @ApiResponse({
    status: 204,
    description:
      'Input data is accepted. Email with confirmation code will be send to passed email address',
  })
  @ApiResponse({
    status: 400,
    type: ErrorViewModel,
    description:
      'If the inputModel has incorrect values (in particular if the user with the given email or login already exists)',
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @ApiBody({ type: CreateUserInputDto })
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() dto: CreateUserInputDto) {
    await this.commandBus.execute(new RegistrationUserCommand(dto));
  }

  @Post('login')
  @ApiOperation({ summary: 'Try login user to the system' })
  @ApiBody({ type: LoginInputDto })
  @ApiResponse({ type: LoginViewModel, status: 200 })
  @ApiResponse({
    status: 400,
    type: ErrorViewModel,
    description: 'If the password or login is wrong',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  // @Throttle({ default: { limit: 5, ttl: 10000 } })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @CurrentUserId() userId: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const ip = req.ip || 'undefined';
    const userAgent: string = req.headers['user-agent'] || 'undefined';
    const {
      accessToken,
      refreshToken,
    }: { accessToken: string; refreshToken: string } =
      await this.commandBus.execute(
        new LoginUserCommand(userId, ip, userAgent),
      );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 24 * 7,
    });
    res.json({ accessToken: accessToken });
  }

  @Post('registration-confirmation')
  @ApiOperation({ summary: 'Confirm registration' })
  @ApiBody({ type: InputCodeValidation })
  @ApiResponse({
    status: 204,
    description: 'Email was verified. Account was activated',
  })
  @ApiResponse({
    status: 400,
    type: ErrorViewModel,
    description:
      'If the confirmation code is incorrect, expired or already been applied',
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmation(@Body() body: InputCodeValidation): Promise<void> {
    await this.commandBus.execute(
      new RegistrationConfirmationCommand(body.code),
    );
  }

  @Post('registration-email-resending')
  @ApiOperation({
    summary: 'Resend confirmation registration Email if user exists',
  })
  @ApiBody({ type: InputEmailValidation })
  @ApiResponse({
    status: 204,
    description: 'Input data is accepted',
  })
  @ApiResponse({
    status: 400,
    type: ErrorViewModel,
    description: 'If the inputModel has incorrect values',
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(
    @Body() body: InputEmailValidation,
  ): Promise<void> {
    await this.commandBus.execute(
      new ResendConfirmationEmailCommand(body.email),
    );
  }

  @Post('password-recovery')
  @ApiOperation({
    summary:
      'Password recovery via Email confirmation. Email should be sent with RecoveryCode inside',
  })
  @ApiBody({ type: InputEmailValidation })
  @ApiResponse({
    status: 204,
    description:
      "Even if current email is not registered (for prevent user's email detection)",
  })
  @ApiResponse({
    status: 400,
    type: ErrorViewModel,
    description:
      'If the inputModel has invalid email (for example 222^gmail.com)',
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() body: InputEmailValidation) {
    await this.commandBus.execute(new PasswordRecoveryCommand(body.email));
  }

  @Post('new-password')
  @ApiOperation({
    summary: 'New Password recovery',
  })
  @ApiBody({ type: InputNewPasswordDto })
  @ApiResponse({
    status: 204,
    description: 'If code is valid and new password is accepted',
  })
  @ApiResponse({
    status: 400,
    type: ErrorViewModel,
    description:
      'If the inputModel has incorrect value (for incorrect password length) or RecoveryCode is incorrect or expired',
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() body: InputNewPasswordDto) {
    await this.commandBus.execute(
      new NewPasswordCommand(body.newPassword, body.recoveryCode),
    );
  }

  @Post('refresh-token')
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'generate new pair of access and refresh token',
  })
  @ApiBody({ type: InputNewPasswordDto })
  @ApiResponse({
    status: 200,
    type: LoginViewModel,
    description:
      'Returns JWT accessToken (expired after 10 seconds) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 seconds).',
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@GetRefreshToken() token: string, @Res() res: Response) {
    const result: {
      accessToken: string;
      refreshToken: string;
    } = await this.commandBus.execute(new RefreshTokenCommand(token));

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return res.json({ accessToken: result.accessToken });
  }

  @Post('logout')
  @ApiCookieAuth()
  @ApiOperation({
    summary:
      'In cookie client must send correct refreshToken that will be revoked',
  })
  @ApiResponse({ status: 204, description: 'No content' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenGuard)
  async logout(@GetRefreshToken() token: string, @Res() res: Response) {
    await this.commandBus.execute(new LogoutCommand(token));
    res.clearCookie('refreshToken');
    return res.sendStatus(204);
  }

  @Get('me')
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get information about current user' })
  @ApiResponse({ status: 200, description: 'Success', type: MeViewModel })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  async me(
    @CurrentUserId(ParseIntPipe) userId: number,
  ): Promise<UserViewModel> {
    return this.queryBus.execute(new GetUserQuery(userId));
  }
}
