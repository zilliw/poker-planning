import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeId } from '../../core/models';
import { PlanningService } from '../../core/planning.service';
import { THEMES } from '../../core/themes';

const randomRoomId = () => Math.random().toString(36).slice(2, 8);

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly router = inject(Router);
  private readonly planning = inject(PlanningService);

  protected readonly themes = THEMES;
  protected readonly name = signal(this.planning.savedName);
  protected readonly theme = signal<ThemeId>('pokemon');
  protected readonly roomCode = signal('');

  create(): void {
    const name = this.name().trim();
    if (!name) return;
    const roomId = randomRoomId();
    this.planning.join(roomId, name, this.theme());
    this.router.navigate(['/room', roomId]);
  }

  joinExisting(): void {
    const code = this.roomCode().trim().toLowerCase().replace(/^.*\/room\//, '');
    if (!code || !this.name().trim()) return;
    this.planning.join(code, this.name().trim());
    this.router.navigate(['/room', code]);
  }
}
