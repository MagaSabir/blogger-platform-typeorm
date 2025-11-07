import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user-accounts/users/entity/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { Session } from '../user-accounts/sessions/entity/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session]), CqrsModule],

  controllers: [TestingController],
})
export class TestingModule {}
