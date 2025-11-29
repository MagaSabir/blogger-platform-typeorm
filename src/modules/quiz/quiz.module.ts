import { Module } from '@nestjs/common';
import { QuizAdminController } from './admin/api/quiz-admin.controller';

@Module({
  imports: [],
  controllers: [QuizAdminController],
  providers: [],
})
export class QuizModule {}
