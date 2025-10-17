import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { catchError, type Observable, take, tap, throwError } from 'rxjs';
import type { AuthSchema } from '../../auth/auth.schema';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile',
  imports: [
    AsyncPipe,
    NgIf,
    MatButtonModule,
    MatCardModule,
    DatePipe,
    MatToolbarModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
  readonly #snack = inject(MatSnackBar);
  readonly #fb = inject(FormBuilder);

  protected readonly form = this.#fb.nonNullable.group({
    firstName: [''],
    lastName: [''],
  });

  protected readonly vm$: Observable<AuthSchema> = this.#authService
    .userState()
    .pipe(
      tap((user) => {
        this.form.patchValue({
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
        });
      }),
    );

  protected onUpdateUser(): void {
    if (this.form.invalid) {
      this.#snack.open('Form is invalid', '', {
        duration: 3000,
      });
      return;
    }

    this.#authService
      .updateProfile(
        this.form.controls.firstName.value,
        this.form.controls.lastName.value,
      )
      .pipe(
        tap((user) => {
          this.#snack.open('Profile updated', '', { duration: 3000 });
          this.form.patchValue({
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
          });
        }),

        catchError((err: unknown) => {
          if (err instanceof HttpErrorResponse) {
            this.#snack.open(err.error?.error ?? 'Update failed', '', {
              duration: 3000,
            });
          }

          return throwError(() => err);
        }),
      )
      .subscribe();
  }

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
