import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameRepository } from '../../infrastructure/game.repository';
import { Game, GameStatus } from '../../entitys/game.entity';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { PlayerRepository } from '../../infrastructure/player.repository';
import { GameQuestion } from '../../entitys/game-question.entity';
import { GameQuestionRepository } from '../../infrastructure/game-question.repository';
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
    // private gameRepo: GameRepository,
    // private playerRepo: PlayerRepository,
    // private gameQuestionRepo: GameQuestionRepository,
    private questionRepo: QuestionRepository,
    private entityManager: EntityManager,
  ) {}

  async execute(command: CreatePairConnectionCommand): Promise<string> {
    return await this.entityManager.transaction(async (manager) => {
      const gameRepo = manager.getRepository(Game);
      const playerRepo = manager.getRepository(Player);
      const gameQuestionRepo = manager.getRepository(GameQuestion);

      const hasGame = await playerRepo
        .createQueryBuilder('p')
        .innerJoin('p.game', 'g')
        .where('p.userId = :userId', { userId: command.userId })
        .andWhere('g.status IN (:...statuses)', {
          statuses: [GameStatus.PENDING, GameStatus.ACTIVE],
        })
        .getCount();

      if (hasGame > 0) {
        throw new ForbiddenException('Already in game');
      }

      let game = await gameRepo
        .createQueryBuilder('g')
        .innerJoinAndSelect('g.players', 'players')
        .setLock('pessimistic_write')
        .where('g.status =:status', { status: GameStatus.PENDING })
        .getOne();

      if (!game) {
        game = Game.create();
        await gameRepo.save(game);
      }
      if (game.players.some((p) => p.userId === command.userId)) {
        throw new ForbiddenException('Already in this game');
      }

      if (game.players.length >= 2) {
        throw new ForbiddenException('Already 2 players');
      }

      const position = game.players.length === 0 ? 1 : 2;

      const player = Player.create(command.userId, position, game.id);
      await playerRepo.save(player);

      game.players.push(player);

      if (position === 2) {
        // game.start();
        game.status = GameStatus.ACTIVE; // ← явно меняем статус
        game.startGameDate = new Date();
        await gameRepo.save(game);

        const questions = await this.questionRepo.getRandomQuestions(5);
        if (questions.length < 5) {
          throw new BadRequestException('Questions must be 5 <=');
        }

        const gameQuestions = questions.map((q, i) =>
          GameQuestion.createGameQuestion(game, q, i),
        );

        await gameQuestionRepo.save(gameQuestions);
      } else {
        await gameRepo.save(game);
      }

      return game.id;
    });
    // if (await this.playerRepo.hasActiveGame(command.userId)) {
    //   throw new ForbiddenException('Already in game');
    // }

    // let game: Game | null = await this.gameRepo.findPendingGame();
    //
    // if (!game) {
    //   game = Game.create();
    //   await this.gameRepo.save(game);
    // }
    //
    // if (game.players.some((p) => p.userId === command.userId)) {
    //   throw new ForbiddenException('Already in this game');
    // }
    //
    // if (game.players.length >= 2) {
    //   throw new ForbiddenException('Already 2 players');
    // }
    //
    // const position = game.players.length === 0 ? 1 : 2;
    //
    // const player = Player.create(command.userId, position, game.id);
    // await this.playerRepo.save(player);
    //
    // game.players.push(player);
    //
    // if (position === 2) {
    //   // game.start();
    //   game.status = GameStatus.ACTIVE; // ← явно меняем статус
    //   game.startGameDate = new Date();
    //   await this.gameRepo.save(game);
    //
    //   const questions = await this.questionRepo.getRandomQuestions(5);
    //   if (questions.length < 5) {
    //     throw new BadRequestException('Questions must be 5 <=');
    //   }
    //
    //   const gameQuestions = questions.map((q, i) =>
    //     GameQuestion.createGameQuestion(game, q, i),
    //   );
    //
    //   await this.gameQuestionRepo.save(gameQuestions);
    // } else {
    //   await this.gameRepo.save(game);
    // }

    // return game.id;
  }
}
