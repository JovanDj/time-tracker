import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import type { Observable } from 'rxjs';
import type { AuthSchema } from '../../auth/auth.schema';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-overview',
  imports: [MatCardModule, AsyncPipe, NgIf],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
  readonly #authService = inject(AuthService);

  protected readonly vm$: Observable<AuthSchema | undefined> =
    this.#authService.userState();
}
