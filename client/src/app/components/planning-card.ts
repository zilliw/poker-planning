import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { CardValue } from '../core/models';
import { ThemeDefinition, cardImage } from '../core/themes';

/** A themed Fibonacci card, face up (value + character) or face down. */
@Component({
  selector: 'app-planning-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (faceDown()) {
      <div class="card back" [class]="'back-' + theme().id" [class.small]="small()">
        <span class="back-logo">{{ theme().emoji }}</span>
        @if (checked()) {
          <span class="check" aria-label="A voté">✔</span>
        }
      </div>
    } @else {
      <div class="card front" [class.small]="small()" [class.selected]="selected()">
        <span class="corner top">{{ value() }}</span>
        @if (art(); as a) {
          @if (image(); as src) {
            <img [src]="src" [alt]="a.name" loading="lazy" (error)="brokenImage.set(src)" />
          } @else {
            <span class="illustration" aria-hidden="true">{{ a.emoji }}</span>
          }
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

  /** Falls back to the emoji illustration when an image fails to load. */
  protected readonly brokenImage = signal<string | null>(null);

  protected readonly art = computed(() => {
    const v = this.value();
    return v ? this.theme().cards[v] : undefined;
  });

  protected readonly image = computed(() => {
    const v = this.value();
    const src = v ? cardImage(this.theme(), v) : undefined;
    return src && src !== this.brokenImage() ? src : undefined;
  });
}
