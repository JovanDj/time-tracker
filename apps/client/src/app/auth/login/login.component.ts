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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly #fb = inject(FormBuilder);
  readonly #auth = inject(AuthService);
  readonly #router = inject(Router);
  readonly #snack = inject(MatSnackBar);

  protected form = this.#fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected email() {
    return this.form.controls.email;
  }

  protected password() {
    return this.form.controls.password;
  }

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.#auth
      .login(this.email().value, this.password().value)
      .pipe(
        take(1),
        tap(() => {
          this.#snack.open('Successfully logged in', '', { duration: 3000 });
          return this.#router.navigate(['/dashboard']);
        }),
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            this.#snack.open(err.error['error']);
          }

          console.error('Login failed:', err);
          return throwError(() => err);
        }),
      )
      .subscribe();
  }
}
