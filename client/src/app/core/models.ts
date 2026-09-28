export const CARD_VALUES = ['0', '1', '2', '3', '5', '8', '13', '21', '?', '☕'] as const;
export type CardValue = (typeof CARD_VALUES)[number];

export type ThemeId = 'pokemon' | 'onepiece' | 'dragonball' | 'mario' | 'football';

export interface Participant {
  id: string;
  name: string;
  hasVoted: boolean;
  vote: CardValue | null;
}

export interface RoomState {
  id: string;
  theme: ThemeId;
  revealed: boolean;
  participants: Participant[];
  myVote: CardValue | null;
}
