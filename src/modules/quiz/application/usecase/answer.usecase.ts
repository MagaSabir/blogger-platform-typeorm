import { AnswerInputDto } from '../../api/admin/input-dto/answer.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameRepository } from '../../infrastructure/game.repository';
import { ForbiddenException } from '@nestjs/common';
import { GameQuestionRepository } from '../../infrastructure/game-question.repository';
import { AnswerRepository } from '../../infrastructure/answer.repository';
import { Answer } from '../../entitys/answer.entity';
import { EntityManager, IsNull } from 'typeorm';
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

      // const gameQuestion = await this.gameQuestionRepo.findQuestionByGameId(
      //   game.id,
      // );
      const gameQuestion = await gameQuestionRepo.find({
        where: { gameId: game.id },
        relations: ['question'],
        order: { order: 'ASC' },
      });
      // const answersCount = await this.answerRepo.countByPlayerId(player.id);
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

      console.log(answersCount);
      game.processAnswer(player, isCorrect, answersCount + 1);
      await gameRepo.save(player);

      await gameRepo.save(game);
      console.log('Game after answer:', {
        id: game.id,
        status: game.status,
        finishGameDate: game.finishGameDate,
        players: game.players.map((p) => ({
          userId: p.userId,
          score: p.score,
          finishedAt: p.finishedAt,
          // isWinner: p.isWinner, нет такого поля
        })),
      });

      return answer.id;
    });
  }
}
