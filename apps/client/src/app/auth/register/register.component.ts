import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { catchError, take, tap, throwError } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  readonly #authService = inject(AuthService);
  readonly #fb = inject(FormBuilder);
  readonly #snack = inject(MatSnackBar);
  readonly #router = inject(Router);

  protected readonly form = this.#fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected email() {
    return this.form.controls.email;
  }

  protected password() {
    return this.form.controls.password;
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.#authService
      .register(this.email().value, this.password().value)
      .pipe(
        take(1),
        tap(() => {
          this.#router.navigate(['/dashboard', 'profile']);

          this.#snack.open('User successfuly registered and logged in', '', {
            duration: 3000,
          });
        }),
        catchError((err: unknown) => {
          if (err instanceof HttpErrorResponse) {
            this.#snack.open(err.error.error, '', {
              duration: 3000,
            });
          }

          return throwError(() => err);
        }),
      )
      .subscribe();
  }
}
