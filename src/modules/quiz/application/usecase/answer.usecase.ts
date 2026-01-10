import { AnswerInputDto } from '../../api/admin/input-dto/answer.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException } from '@nestjs/common';
import { Answer } from '../../entitys/answer.entity';
import { EntityManager } from 'typeorm';
import { GameQuestion } from '../../entitys/game-question.entity';
import { Game, GameStatus } from '../../entitys/game.entity';
import { Player } from '../../entitys/player.entity';
import { DomainException } from '../../../../core/exceptions/domain.exceptions';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception-codes';

export class AnswerCommand {
  constructor(
    public userId: string,
    public dto: AnswerInputDto,
  ) {}
}

@CommandHandler(AnswerCommand)
export class AnswerUseCase implements ICommandHandler<AnswerCommand> {
  constructor(private entityManager: EntityManager) {}

  async execute(command: AnswerCommand) {
    return await this.entityManager.transaction(async (manager) => {
      const gameRepo = manager.getRepository(Game);
      const playerRepo = manager.getRepository(Player);
      const answerRepo = manager.getRepository(Answer);
      const gameQuestionRepo = manager.getRepository(GameQuestion);
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

      const [player, otherPlayer] = await Promise.all([
        playerRepo
          .createQueryBuilder('p')
          .setLock('pessimistic_write')
          .where('p.userId = :userId', { userId: command.userId })
          .andWhere('p.gameId = :gameId', { gameId: game.id })
          .getOne(),
        playerRepo
          .createQueryBuilder('p')
          .setLock('pessimistic_write')
          .where('p.gameId = :gameId', { gameId: game.id })
          .andWhere('p.userId != :userId', { userId: command.userId })
          .getOne(),
      ]);

      if (!player || !otherPlayer) {
        throw new DomainException({
          code: DomainExceptionCodes.BadRequest,
          message: 'player not found in game',
        });
      }
      const gameQuestion = await gameQuestionRepo.find({
        where: { gameId: game.id },
        relations: ['question'],
        order: { order: 'ASC' },
      });

      const answersCount = await answerRepo
        .createQueryBuilder('a')
        .where('a.playerId = :playerId', { playerId: player.id })
        .getCount();

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

      const currentAnswerNumber = answersCount + 1;
      if (isCorrect) {
        player.score += 1;
      }

      if (currentAnswerNumber === 5) {
        player.finish();

        if (otherPlayer && otherPlayer.finishedAt && player.finishedAt) {
          if (player.finishedAt < otherPlayer.finishedAt && player.score > 0) {
            player.score += 1; // бонус
          } else if (
            otherPlayer.finishedAt < player.finishedAt &&
            otherPlayer.score > 0
          ) {
            otherPlayer.score += 1;
          }
          game.status = GameStatus.FINISHED;
          game.finishGameDate = new Date();
        }
      }

      await playerRepo.save([player, otherPlayer]);

      await gameRepo.save(game);

      return answer.id;
    });
  }
}
