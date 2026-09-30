import { Injectable, computed, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { CardValue, RoomState, Story, ThemeId } from './models';

const NAME_KEY = 'poker.name';
const CLIENT_KEY = 'poker.clientId';

function storage(kind: 'local' | 'session'): Storage | null {
  try {
    return kind === 'local' ? localStorage : sessionStorage;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class PlanningService {
  private socket?: Socket;
  private joined?: { roomId: string; name: string; theme?: ThemeId };

  readonly state = signal<RoomState | null>(null);
  readonly connected = signal(false);
  readonly error = signal<string | null>(null);

  /** Per tab id so that two tabs of the same browser are two participants, but a reload keeps the vote. */
  readonly clientId = (() => {
    const s = storage('session');
    let id = s?.getItem(CLIENT_KEY);
    if (!id) {
      id = crypto.randomUUID();
      s?.setItem(CLIENT_KEY, id);
    }
    return id;
  })();

  readonly votedCount = computed(() => this.state()?.participants.filter((p) => p.hasVoted).length ?? 0);

  get currentRoomId(): string | undefined {
    return this.joined?.roomId;
  }

  get savedName(): string {
    return storage('local')?.getItem(NAME_KEY) ?? '';
  }

  join(roomId: string, name: string, theme?: ThemeId): void {
    storage('local')?.setItem(NAME_KEY, name);
    this.joined = { roomId, name, theme };
    this.error.set(null);
    if (!this.socket) {
      this.socket = io({ transports: ['websocket', 'polling'] });
      this.socket.on('connect', () => {
        this.connected.set(true);
        this.emitJoin(); // also re-joins after a reconnection
      });
      this.socket.on('disconnect', () => this.connected.set(false));
      this.socket.on('state', (s: RoomState) => this.state.set(s));
    } else if (this.socket.connected) {
      this.emitJoin();
    }
  }

  leave(): void {
    this.socket?.disconnect();
    this.socket = undefined;
    this.joined = undefined;
    this.state.set(null);
    this.connected.set(false);
  }

  vote(value: CardValue | null): void {
    // Optimistic update so the selected card reacts instantly.
    this.state.update((s) => (s && !s.revealed ? { ...s, myVote: value } : s));
    this.socket?.emit('vote', value);
  }

  reveal(): void {
    this.socket?.emit('reveal');
  }

  /** Votes again on the same story. */
  revote(): void {
    this.socket?.emit('revote');
  }

  /** Next story: resets votes, title and link. */
  clear(): void {
    this.socket?.emit('clear');
  }

  setStory(story: Story): void {
    this.state.update((s) => (s ? { ...s, story } : s));
    this.socket?.emit('setStory', story);
  }

  setTheme(theme: ThemeId): void {
    this.socket?.emit('setTheme', theme);
  }

  private emitJoin(): void {
    if (!this.joined || !this.socket) return;
    this.socket.emit(
      'join',
      { ...this.joined, clientId: this.clientId },
      (res: { ok: boolean; error?: string }) => {
        if (!res.ok) this.error.set(res.error ?? 'Impossible de rejoindre la room.');
      },
    );
  }
}
