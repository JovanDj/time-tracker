import { AsyncPipe, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { catchError, type Observable, take, tap, throwError } from 'rxjs';
import type { AuthSchema } from '../auth/auth.schema';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatToolbarModule,
    NgIf,
    AsyncPipe,
    RouterOutlet,
    RouterLink,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
  readonly #snack = inject(MatSnackBar);

  protected readonly vm$: Observable<AuthSchema | undefined> =
    this.#authService.userState();

  protected onLogout() {
    this.#authService
      .logout()
      .pipe(
        take(1),
        tap(() => {
          this.#snack.open('Successfully logged out', '', { duration: 3000 });
          return this.#router.navigate(['/login']);
        }),

        catchError((err: unknown) => {
          if (err instanceof HttpErrorResponse) {
            this.#snack.open(err.message, '', { duration: 3000 });
          }

          return throwError(() => err);
        }),
      )
      .subscribe();
  }
}
