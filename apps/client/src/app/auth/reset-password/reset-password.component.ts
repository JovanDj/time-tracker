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
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, take, tap } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCard,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  readonly #fb = inject(FormBuilder);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);
  readonly #snack = inject(MatSnackBar);

  protected readonly form = this.#fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected password() {
    return this.form.controls.password;
  }

  async onSubmit() {
    const token = this.#route.snapshot.queryParamMap.get('token');

    if (this.form.invalid || !token) {
      this.#snack.open('Form or token invalid', '', {
        duration: 3000,
      });
      return;
    }

    this.#authService
      .resetPassword(token, this.password().value)
      .pipe(
        take(1),
        tap(() => {
          this.#snack.open('Password reset successful', '', {
            duration: 3000,
          });
          this.#router.navigate(['/login']);
        }),
        catchError((err) => {
          this.#snack.open('Invalid or expired token', '', { duration: 3000 });

          return err;
        }),
      )
      .subscribe();
  }
}
