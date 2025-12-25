import { AnswerInputDto } from '../../api/admin/input-dto/answer.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameRepository } from '../../infrastructure/game.repository';
import { ForbiddenException } from '@nestjs/common';
import { GameQuestionRepository } from '../../infrastructure/game-question.repository';
import { AnswerRepository } from '../../infrastructure/answer.repository';
import { Answer } from '../../entitys/answer.entity';

export class AnswerCommand {
  constructor(
    public userId: string,
    public dto: AnswerInputDto,
  ) {}
}

@CommandHandler(AnswerCommand)
export class AnswerUseCase implements ICommandHandler<AnswerCommand> {
  constructor(
    private gameRepo: GameRepository,
    private gameQuestionRepo: GameQuestionRepository,
    private answerRepo: AnswerRepository,
  ) {}

  async execute(command: AnswerCommand) {
    const game = await this.gameRepo.findActiveGameByUserId(command.userId);
    if (!game) throw new ForbiddenException();

    const player = game.getPlayerById(command.userId);
    const gameQuestion = await this.gameQuestionRepo.findQuestionByGameId(
      game.id,
    );
    const answersCount = await this.answerRepo.countByPlayerId(player.id);

    if (answersCount >= gameQuestion.length) {
      throw new ForbiddenException('already answered to all questions');
    }

    const currentGameQuestion = gameQuestion[answersCount];
    const isCorrect = currentGameQuestion.question.correctAnswers.includes(
      command.dto.answer,
    );

    const answer = Answer.create(
      player.id,
      currentGameQuestion.questionId,
      isCorrect,
    );
  }
}
