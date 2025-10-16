import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { catchError, take, tap } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCard,
    RouterLink,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  readonly #fb = inject(FormBuilder);
  readonly #authService = inject(AuthService);
  readonly #snack = inject(MatSnackBar);

  protected readonly form = this.#fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected email() {
    return this.form.controls.email;
  }

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.#authService
      .forgotPassword(this.email().value)
      .pipe(
        take(1),
        tap(() => {
          this.#snack.open('If account exists, email sent', '', {
            duration: 3000,
          });
        }),
        catchError((err) => {
          this.#snack.open('Something went wrong', '', { duration: 3000 });

          return err;
        }),
      )
      .subscribe();
  }
}
