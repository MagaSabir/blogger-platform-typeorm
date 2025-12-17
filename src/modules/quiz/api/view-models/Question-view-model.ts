import { Question } from '../../entitys/questions.entity';

export class QuestionViewModel {
  id: string;
  body: string;
  correctAnswers: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date | null;

  static mapToView(question: Question) {
    const dto = new QuestionViewModel();
    dto.id = question.id;
    dto.body = question.body;
    dto.correctAnswers = question.correctAnswers;
    dto.published = question.published;
    dto.createdAt = question.createdAt;
    dto.updatedAt = question.updatedAt;
    return dto;
  }
}
