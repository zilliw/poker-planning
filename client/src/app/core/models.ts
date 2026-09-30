export const CARD_VALUES = ['0', '1', '2', '3', '5', '8', '13', '21', '?', '☕'] as const;
export type CardValue = (typeof CARD_VALUES)[number];

export type ThemeId = 'pokemon' | 'onepiece' | 'dragonball' | 'mario' | 'kpop' | 'naruto';

export interface Participant {
  id: string;
  name: string;
  hasVoted: boolean;
  vote: CardValue | null;
}

/** The user story being estimated, shared by the whole room. */
export interface Story {
  title: string;
  link: string;
}

export interface RoomState {
  id: string;
  theme: ThemeId;
  revealed: boolean;
  story: Story;
  participants: Participant[];
  myVote: CardValue | null;
}
