export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  category?: string;
}

export interface StudyDeck {
  topic: string;
  summary: string;
  cards: Flashcard[];
}

export type CardMastery = 'unreviewed' | 'mastered' | 'learning';

export interface GenerationError {
  message: string;
  code?: 'EMPTY_INPUT' | 'API_ERROR' | 'MALFORMED_OUTPUT' | 'ABORTED' | 'RATE_LIMITED' | 'UNKNOWN';
  rawOutput?: string;
  canRetry?: boolean;
}
