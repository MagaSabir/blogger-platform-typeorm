import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameRepository } from '../../infrastructure/game.repository';
import { Game, GameStatus } from '../../entitys/game.entity';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { PlayerRepository } from '../../infrastructure/player.repository';
import { GameQuestion } from '../../entitys/game-question.entity';
import { GameQuestionRepository } from '../../infrastructure/game-question.repository';
import { QuestionRepository } from '../../infrastructure/question.repository';
import { Player } from '../../entitys/player.entity';

export class CreatePairConnectionCommand {
  constructor(public userId: string) {}
}

@CommandHandler(CreatePairConnectionCommand)
export class CreatePairConnectionUseCase
  implements ICommandHandler<CreatePairConnectionCommand>
{
  constructor(
    private gameRepo: GameRepository,
    private playerRepo: PlayerRepository,
    private gameQuestionRepo: GameQuestionRepository,
    private questionRepo: QuestionRepository,
  ) {}

  async execute(command: CreatePairConnectionCommand): Promise<string> {
    if (await this.playerRepo.hasActiveGame(command.userId)) {
      throw new ForbiddenException('Already in game');
    }

    let game: Game | null = await this.gameRepo.findPendingGame();

    if (!game) {
      game = Game.create();
      await this.gameRepo.save(game);
    }

    if (game.players.some((p) => p.userId === command.userId)) {
      throw new ForbiddenException('Already in this game');
    }

    if (game.players.length >= 2) {
      throw new ForbiddenException('Already 2 players');
    }

    const position = game.players.length === 0 ? 1 : 2;

    const player = Player.create(command.userId, position, game.id);
    await this.playerRepo.save(player);

    game.players.push(player);

    if (position === 2) {
      game.start();
      await this.gameRepo.save(game);

      const questions = await this.questionRepo.getRandomQuestions(5);
      if (questions.length < 5) {
        throw new BadRequestException('Questions must be 5 <=');
      }

      const gameQuestions = questions.map((q, i) =>
        GameQuestion.createGameQuestion(game, q, i),
      );

      await this.gameQuestionRepo.save(gameQuestions);
    } else {
      await this.gameRepo.save(game);
    }

    return game.id;
  }
}
