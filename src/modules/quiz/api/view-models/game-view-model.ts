import { GameStatus } from '../../entitys/game.entity';

export type AnswerStatus = 'Correct' | 'Incorrect';

export type RawGameData = {
  id: string;
  status: GameStatus;
  pairCreatedDate: Date;
  startGameDate: Date | null;
  finishGameDate: Date | null;
};

export type RawPlayerData = {
  playerId: string;
  position: number;
  score: number;
  userId: string;
  login: string;
};

export type RawAnswerData = {
  questionId: string;
  answerStatus: AnswerStatus;
  addedAt: Date;
  playerId: string;
};

export class AnswerViewModel {
  questionId: string;
  answerStatus: AnswerStatus;
  addedAt: Date;
}

export class PlayerViewModel {
  id: string;
  login: string;
}

export class PlayerProgressViewModel {
  answers: AnswerViewModel[];
  player: PlayerViewModel;
  score: number;
}

export class GameViewModel {
  id: string;
  firstPlayerProgress: PlayerProgressViewModel | null;
  secondPlayerProgress: PlayerProgressViewModel | null;
  questions: {
    id: string;
    body: string;
  }[];
  status: GameStatus;
  pairCreatedDate: Date;
  startGameDate: Date | null;
  finishGameDate: Date | null;
}
