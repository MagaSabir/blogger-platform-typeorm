import {
  GameViewModel,
  PlayerProgressViewModel,
  RawAnswerData,
  RawGameData,
  RawPlayerData,
  RawQuestionData,
} from './game-view-model';
import { GameStatus } from '../../entitys/game.entity';

export class GameViewModelMapper {
  static mapToViewModel(
    game: RawGameData,
    players: RawPlayerData[],
    answers: RawAnswerData[],
    questions: RawQuestionData[],
  ): GameViewModel {
    const mapPlayer = (position: 1 | 2): PlayerProgressViewModel | null => {
      const player = players.find((p) => p.position === position);
      if (!player) return null;

      return {
        answers: answers
          .filter((a) => a.playerId === player.playerId)
          .map((a) => ({
            questionId: a.questionId,
            answerStatus: a.answerStatus,
            addedAt: a.addedAt,
          })),
        player: {
          id: player.userId,
          login: player.login,
        },
        score: player.score,
      };
    };

    return {
      id: game.id,
      firstPlayerProgress: mapPlayer(1),
      secondPlayerProgress: mapPlayer(2),
      questions:
        game.status !== GameStatus.PENDING
          ? questions.map((q) => ({ id: q.id, body: q.body }))
          : null,
      status: game.status,
      pairCreatedDate: game.pairCreatedDate,
      startGameDate: game.startGameDate,
      finishGameDate: game.finishGameDate,
    };
  }
}
