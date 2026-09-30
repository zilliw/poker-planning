export const CARD_VALUES = ['0', '1', '2', '3', '5', '8', '13', '21', '?', '☕'] as const;
export const THEMES = ['pokemon', 'onepiece', 'dragonball', 'mario', 'kpop'] as const;
export const MAX_PARTICIPANTS = 20;
export const MAX_STORY_TITLE = 200;
export const MAX_STORY_LINK = 500;

export type CardValue = (typeof CARD_VALUES)[number];
export type Theme = (typeof THEMES)[number];

interface Participant {
  id: string;
  name: string;
  vote: CardValue | null;
  sockets: Set<string>;
}

/** The user story being estimated; free text shared by the whole room. */
export interface Story {
  title: string;
  link: string;
}

export interface Room {
  id: string;
  theme: Theme;
  revealed: boolean;
  story: Story;
  participants: Map<string, Participant>;
}

export interface ParticipantView {
  id: string;
  name: string;
  hasVoted: boolean;
  /** Only filled once the votes are revealed. */
  vote: CardValue | null;
}

export interface RoomView {
  id: string;
  theme: Theme;
  revealed: boolean;
  story: Story;
  participants: ParticipantView[];
  myVote: CardValue | null;
}

export const isCardValue = (v: unknown): v is CardValue =>
  typeof v === 'string' && (CARD_VALUES as readonly string[]).includes(v);

export const isTheme = (v: unknown): v is Theme =>
  typeof v === 'string' && (THEMES as readonly string[]).includes(v);

export class RoomStore {
  private rooms = new Map<string, Room>();

  get(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  join(roomId: string, clientId: string, name: string, socketId: string, theme?: Theme): Room {
    let room = this.rooms.get(roomId);
    if (!room) {
      room = {
        id: roomId,
        theme: theme ?? 'pokemon',
        revealed: false,
        story: { title: '', link: '' },
        participants: new Map(),
      };
      this.rooms.set(roomId, room);
    }
    const existing = room.participants.get(clientId);
    if (existing) {
      existing.name = name;
      existing.sockets.add(socketId);
    } else {
      if (room.participants.size >= MAX_PARTICIPANTS) {
        throw new Error(`La room est pleine (${MAX_PARTICIPANTS} participants max).`);
      }
      room.participants.set(clientId, { id: clientId, name, vote: null, sockets: new Set([socketId]) });
    }
    return room;
  }

  /** Detaches a socket; returns true when the participant has no socket left. */
  detach(room: Room, clientId: string, socketId: string): boolean {
    const p = room.participants.get(clientId);
    if (!p) return false;
    p.sockets.delete(socketId);
    return p.sockets.size === 0;
  }

  /** Removes the participant if still disconnected; deletes the room when empty. */
  removeIfGone(room: Room, clientId: string): void {
    const p = room.participants.get(clientId);
    if (p && p.sockets.size === 0) room.participants.delete(clientId);
    if (room.participants.size === 0) this.rooms.delete(room.id);
  }

  vote(room: Room, clientId: string, value: CardValue | null): void {
    const p = room.participants.get(clientId);
    if (!p) return;
    // Votes are frozen once revealed, until the table is cleaned.
    if (room.revealed) return;
    p.vote = value;
  }

  reveal(room: Room): void {
    room.revealed = true;
  }

  /** New voting round on the same story: votes are reset and hidden again. */
  revote(room: Room): void {
    room.revealed = false;
    for (const p of room.participants.values()) p.vote = null;
  }

  /** Moves on to the next story: votes and story are reset. */
  clear(room: Room): void {
    this.revote(room);
    room.story = { title: '', link: '' };
  }

  setStory(room: Room, story: Story): void {
    room.story = {
      title: story.title.trim().slice(0, MAX_STORY_TITLE),
      link: story.link.trim().slice(0, MAX_STORY_LINK),
    };
  }

  setTheme(room: Room, theme: Theme): void {
    room.theme = theme;
  }

  /** Personalised view: other participants' votes stay hidden until reveal. */
  view(room: Room, clientId: string): RoomView {
    return {
      id: room.id,
      theme: room.theme,
      revealed: room.revealed,
      story: room.story,
      myVote: room.participants.get(clientId)?.vote ?? null,
      participants: [...room.participants.values()].map((p) => ({
        id: p.id,
        name: p.name,
        hasVoted: p.vote !== null,
        vote: room.revealed ? p.vote : null,
      })),
    };
  }
}
