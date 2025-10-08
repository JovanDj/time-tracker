import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { take, tap } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  readonly #authService = inject(AuthService);
  readonly #fb = inject(FormBuilder);

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

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.#authService
      .register(this.email().value, this.password().value)
      .pipe(
        take(1),
        tap(() => {
          alert('User successfully registered');
        }),
      )
      .subscribe();
  }
}
