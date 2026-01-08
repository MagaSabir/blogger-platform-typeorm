import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Game, GameStatus } from '../../entitys/game.entity';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { GameQuestion } from '../../entitys/game-question.entity';
import { QuestionRepository } from '../../infrastructure/question.repository';
import { Player } from '../../entitys/player.entity';
import { EntityManager } from 'typeorm';

export class CreatePairConnectionCommand {
  constructor(public userId: string) {}
}

@CommandHandler(CreatePairConnectionCommand)
export class CreatePairConnectionUseCase
  implements ICommandHandler<CreatePairConnectionCommand>
{
  constructor(
    private questionRepo: QuestionRepository,
    private entityManager: EntityManager,
  ) {}

  async execute(command: CreatePairConnectionCommand): Promise<string> {
    return await this.entityManager.transaction(async (manager) => {
      const gameRepo = manager.getRepository(Game);
      const playerRepo = manager.getRepository(Player);
      const gameQuestionRepo = manager.getRepository(GameQuestion);

      const existingGame = await playerRepo
        .createQueryBuilder('p')
        .innerJoin('p.game', 'g')
        .where('p.userId = :userId', { userId: command.userId })
        .andWhere('g.status IN (:...statuses)', {
          statuses: [GameStatus.PENDING, GameStatus.ACTIVE],
        })
        .getOne();

      if (existingGame) {
        throw new ForbiddenException('Already in game');
      }

      let game = await gameRepo
        .createQueryBuilder('g')
        .where('g.status =:status', { status: GameStatus.PENDING })
        .setLock('pessimistic_write')
        .getOne();

      if (!game) {
        game = Game.create();
        await gameRepo.save(game);
      }
      const playerCounts = await playerRepo.count({
        where: { gameId: game.id },
      });

      if (playerCounts >= 2) {
        throw new ForbiddenException('Already 2 players');
      }

      const position: 1 | 2 = playerCounts === 0 ? 1 : 2;

      const player = Player.create(command.userId, position, game.id);
      await playerRepo.save(player);

      if (position === 2) {
        // game.start();
        game.status = GameStatus.ACTIVE; // ← явно меняем статус
        game.startGameDate = new Date();
        await gameRepo.save(game);

        const questions = await this.questionRepo.getRandomQuestions(5);
        if (questions.length < 5) {
          throw new BadRequestException('Questions must be >= 5');
        }

        const gameQuestions = questions.map((q, i) =>
          GameQuestion.createGameQuestion(game, q, i),
        );

        await gameQuestionRepo.save(gameQuestions);
      }

      return game.id;
    });
  }
}
