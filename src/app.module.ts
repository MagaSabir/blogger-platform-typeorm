import { configModule } from './config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestingModule } from './modules/testing/testing.module';
import { NotificationModule } from './modules/notification/notification.module';
import { APP_FILTER } from '@nestjs/core';
import { DomainHttpExceptionsFilter } from './core/exceptions/filters/error-exception-filter';
import { ThrottlerModule } from '@nestjs/throttler';
import { CoreConfig } from './core/config/core.config';
import { CoreModule } from './core/config/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/user-accounts/users.module';
import { BloggerPlatformModule } from './modules/blogger-platform/blogger-platform.module';
import { throttlerSetup } from './setup/throtller.setup';
import { QuizModule } from './modules/quiz/quiz.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    CoreModule,
    ConfigModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: '',
        port: 6,
        password:
          '\',
        tls: {},
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => ({
        type: 'postgres',
        host: coreConfig.host,
        port: coreConfig.db_port,
        username: coreConfig.username,
        password: coreConfig.password,
        database: coreConfig.database,
        autoLoadEntities: true,
        logging: false,
      }),
      inject: [CoreConfig],
    }),
    configModule,
    ThrottlerModule.forRoot(throttlerSetup),
    TestingModule,
    NotificationModule,
    UsersModule,
    BloggerPlatformModule,
    QuizModule,
  ],
  controllers: [AppController],
  providers: [
    CoreConfig,
    AppService,
    { provide: APP_FILTER, useClass: DomainHttpExceptionsFilter },
  ],
})
export class AppModule {}
