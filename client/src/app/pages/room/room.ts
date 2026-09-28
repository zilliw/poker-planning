import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CARD_VALUES, CardValue, ThemeId } from '../../core/models';
import { PlanningService } from '../../core/planning.service';
import { THEMES, themeById } from '../../core/themes';
import { PlanningCard } from '../../components/planning-card';

@Component({
  selector: 'app-room',
  imports: [FormsModule, RouterLink, PlanningCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './room.html',
  styleUrl: './room.scss',
})
export class Room implements OnInit, OnDestroy {
  /** Bound from the `:id` route param. */
  readonly id = input.required<string>();

  protected readonly planning = inject(PlanningService);
  protected readonly cards = CARD_VALUES;
  protected readonly themes = THEMES;

  protected readonly name = signal(this.planning.savedName);
  protected readonly needsName = signal(false);
  protected readonly copied = signal(false);

  protected readonly state = this.planning.state;
  protected readonly theme = computed(() => themeById(this.state()?.theme ?? 'pokemon'));
  protected readonly palette = computed(() => this.theme().palette);

  protected readonly stats = computed(() => {
    const s = this.state();
    if (!s?.revealed) return null;
    const votes = s.participants.map((p) => p.vote).filter((v): v is CardValue => v !== null);
    const counts = new Map<CardValue, number>();
    for (const v of votes) counts.set(v, (counts.get(v) ?? 0) + 1);
    const distribution = [...counts.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count);
    // Most voted estimate; on a tie the highest card wins (? and ☕ lose every tie).
    const rank = (v: CardValue) => (isNaN(Number(v)) ? -1 : Number(v));
    const top = [...counts.entries()].sort(([va, ca], [vb, cb]) => cb - ca || rank(vb) - rank(va))[0];
    return {
      consensus: votes.length > 1 && counts.size === 1,
      distribution,
      topVote: top ? { value: top[0], count: top[1] } : null,
    };
  });

  ngOnInit(): void {
    if (this.planning.currentRoomId === this.id()) return; // already joined from the home page
    if (this.name().trim()) {
      this.planning.join(this.id(), this.name().trim());
    } else {
      this.needsName.set(true);
    }
  }

  ngOnDestroy(): void {
    this.planning.leave();
  }

  protected submitName(): void {
    const name = this.name().trim();
    if (!name) return;
    this.needsName.set(false);
    this.planning.join(this.id(), name);
  }

  protected pick(value: CardValue): void {
    const s = this.state();
    if (!s || s.revealed) return;
    this.planning.vote(s.myVote === value ? null : value);
  }

  protected changeTheme(theme: ThemeId): void {
    this.planning.setTheme(theme);
  }

  protected async copyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(location.href);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      /* clipboard unavailable (http, permissions): the URL stays visible in the address bar */
    }
  }
}
