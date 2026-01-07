import { AnswerInputDto } from '../../api/admin/input-dto/answer.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException } from '@nestjs/common';
import { Answer } from '../../entitys/answer.entity';
import { EntityManager } from 'typeorm';
import { GameQuestion } from '../../entitys/game-question.entity';
import { Game, GameStatus } from '../../entitys/game.entity';
import { Player } from '../../entitys/player.entity';

export class AnswerCommand {
  constructor(
    public userId: string,
    public dto: AnswerInputDto,
  ) {}
}

@CommandHandler(AnswerCommand)
export class AnswerUseCase implements ICommandHandler<AnswerCommand> {
  constructor(
    // private gameRepo: GameRepository,
    // private gameQuestionRepo: GameQuestionRepository,
    // private answerRepo: AnswerRepository,
    private entityManager: EntityManager,
  ) {}

  async execute(command: AnswerCommand) {
    return await this.entityManager.transaction(async (manager) => {
      const gameRepo = manager.getRepository(Game);
      const playerRepo = manager.getRepository(Player);
      const answerRepo = manager.getRepository(Answer);
      const gameQuestionRepo = manager.getRepository(GameQuestion);
      // const game = await this.gameRepo.findActiveGameByUserId(command.userId);
      const game = await gameRepo
        .createQueryBuilder('game')
        .innerJoinAndSelect('game.players', 'players') // ← INNER JOIN
        .where(
          'game.id IN (SELECT p."gameId" FROM "Player" p WHERE p."userId" = :userId)',
          {
            userId: command.userId,
          },
        )
        .andWhere('game.status = :status', { status: GameStatus.ACTIVE })
        .andWhere('game.finishGameDate IS NULL')
        .setLock('pessimistic_write')
        .getOne();

      if (!game) throw new ForbiddenException('No active game');

      const player = game.getPlayerById(command.userId);
      const otherPlayer = game.players.find((p) => p.userId !== command.userId);

      const gameQuestion = await gameQuestionRepo.find({
        where: { gameId: game.id },
        relations: ['question'],
        order: { order: 'ASC' },
      });

      const answersCount = await answerRepo.count({
        where: { playerId: player.id },
      });

      if (answersCount >= 5) {
        throw new ForbiddenException('already answered to all questions');
      }

      const currentGameQuestion = gameQuestion[answersCount];
      const isCorrect = currentGameQuestion.question.correctAnswers.includes(
        command.dto.answer,
      );

      const answer: Answer = Answer.create(
        player.id,
        currentGameQuestion.questionId,
        isCorrect,
      );

      await answerRepo.save(answer);

      // game.processAnswer(player, isCorrect, answersCount + 1);
      const currentAnswerNumber = answersCount + 1;
      if (isCorrect) {
        player.score += 1;
      }
      if (currentAnswerNumber === 5) {
        player.finishedAt = new Date();
      }
      if (otherPlayer && otherPlayer.finishedAt) {
        game.status = GameStatus.FINISHED;
        game.finishGameDate = new Date();
      }
      await playerRepo.save(player);
      await gameRepo.save(game);

      return answer.id;
    });
  }
}
