import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CardValue } from '../core/models';
import { ThemeDefinition } from '../core/themes';

/** A themed Fibonacci card, face up (value + character) or face down. */
@Component({
  selector: 'app-planning-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (faceDown()) {
      <div class="card back" [class.small]="small()">
        <span class="back-logo">{{ theme().emoji }}</span>
        @if (checked()) {
          <span class="check" aria-label="A voté">✔</span>
        }
      </div>
    } @else {
      <div class="card front" [class.small]="small()" [class.selected]="selected()">
        <span class="corner top">{{ value() }}</span>
        @if (art(); as a) {
          <img [src]="a.image" [alt]="a.name" loading="lazy" />
          <span class="name">{{ a.name }}</span>
        } @else {
          <span class="big">{{ value() }}</span>
        }
        <span class="corner bottom">{{ value() }}</span>
      </div>
    }
  `,
  styleUrl: './planning-card.scss',
})
export class PlanningCard {
  readonly value = input<CardValue | null>(null);
  readonly theme = input.required<ThemeDefinition>();
  readonly faceDown = input(false);
  readonly checked = input(false);
  readonly selected = input(false);
  readonly small = input(false);

  protected readonly art = computed(() => {
    const v = this.value();
    return v ? this.theme().cards[v] : undefined;
  });
}
