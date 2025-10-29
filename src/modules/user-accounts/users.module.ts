import { Module } from '@nestjs/common';
import { UsersController } from './users/api/users.controller';
import { UsersQueryRepository } from './users/infrastructure/query-repository/users.query-repository';
import { UsersRepository } from './users/infrastructure/users.repository';
import { CreateUserUseCase } from './users/application/usecase/admins/create-user.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteUserUseCase } from './users/application/usecase/admins/delete-user.usecase';
import { BasicStrategy } from './guards/basic/basic.strategy';
import { LocalStrategy } from './guards/local/local.strategy';
import { AuthService } from './users/application/services/auth.service';
import { PasswordService } from './users/application/services/password.service';
import { GetAllUsersQueryHandler } from './users/application/queries/get-all-users.query';
import { UsersConfig } from './config/users.config';
import { RegistrationUserUseCase } from './users/application/usecase/registration-user.usecase';
import { AuthController } from './users/api/auth.controller';
import { JwtService } from '@nestjs/jwt';
import { LoginUserUseCase } from './users/application/usecase/login-user.usecase';
import { SessionRepository } from './sessions/infrastructure/session-repository';
import { CoreConfig } from '../../core/config/core.config';
import { JwtStrategy } from './guards/bearer/jwt-strategy';
import { GetUserQueryHandler } from './users/application/queries/get-user.query';
import { AuthQueryRepository } from './users/infrastructure/query-repository/auth.query-repository';
import { RegistrationConfirmationUseCase } from './users/application/usecase/registration-confirmation.usecase';
import { ResendConfirmationEmailUseCase } from './users/application/usecase/resend-confirmation-email.usecase';
import { PasswordRecoveryUseCase } from './users/application/usecase/password-recovery.usecase';
import { NewPasswordUseCase } from './users/application/usecase/new-password.usecase';
import { LogoutUseCase } from './users/application/usecase/logout.usecase';
import { RefreshTokenUseCase } from './users/application/usecase/refresh-token.usecase';
import { SecurityDevicesController } from './security-devices/api/security-devices.controller';
import { GetDevicesQueryHandler } from './security-devices/queries/get-devices.query';
import { DeleteOtherActiveSessionUseCase } from './security-devices/usecases/delete-other-active-session.usecase';
import { DeleteSessionUseCase } from './security-devices/usecases/delete-sesion.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entity/user.entity';

const commandHandlers = [
  CreateUserUseCase,
  DeleteUserUseCase,
  RegistrationUserUseCase,
  LoginUserUseCase,
  RegistrationConfirmationUseCase,
  ResendConfirmationEmailUseCase,
  PasswordRecoveryUseCase,
  NewPasswordUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
  DeleteOtherActiveSessionUseCase,
  DeleteSessionUseCase,
];

const refreshTokenConnectionProvider = [
  {
    provide: 'ACCESS-TOKEN',
    useFactory: (coreConfig: CoreConfig): JwtService => {
      return new JwtService({
        secret: coreConfig.accessTokenSecret,
        signOptions: { expiresIn: '10m' },
      });
    },
    inject: [CoreConfig],
  },

  {
    provide: 'REFRESH-TOKEN',
    useFactory: (coreConfig: CoreConfig): JwtService => {
      return new JwtService({
        secret: coreConfig.refreshTokenSecret,
        signOptions: { expiresIn: '20m' },
      });
    },
    inject: [CoreConfig],
  },
];

@Module({
  imports: [TypeOrmModule.forFeature([User]), CqrsModule],
  controllers: [UsersController, AuthController, SecurityDevicesController],
  providers: [
    ...refreshTokenConnectionProvider,
    UsersConfig,
    UsersRepository,
    UsersQueryRepository,
    AuthQueryRepository,
    SessionRepository,
    BasicStrategy,
    LocalStrategy,
    JwtStrategy,
    AuthService,
    PasswordService,
    GetAllUsersQueryHandler,
    GetDevicesQueryHandler,
    GetUserQueryHandler,
    ...commandHandlers,
  ],
})
export class UsersModule {}
