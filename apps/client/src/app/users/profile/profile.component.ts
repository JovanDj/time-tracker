import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { type Observable, take, tap } from 'rxjs';
import type { AuthSchema } from '../../auth/auth.schema';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile',
  imports: [AsyncPipe, NgIf, MatButtonModule, MatCardModule, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);

  protected readonly vm$: Observable<AuthSchema> = this.#authService.me();

  protected onLogout() {
    this.#authService
      .logout()
      .pipe(
        take(1),
        tap(() => {
          return this.#router.navigate(['/login']);
        }),
      )
      .subscribe();
  }
}
