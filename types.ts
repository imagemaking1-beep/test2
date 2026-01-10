
export interface QuizQuestion {
  emojis: string;
  answer: string;
  aliases: string[];
  hint: string;
}

export enum GameState {
  START = 'START',
  SELECT_THEME = 'SELECT_THEME',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  END = 'END'
}

export interface QuizTheme {
  id: string;
  name: string;
  icon: string;
  description: string;
}
