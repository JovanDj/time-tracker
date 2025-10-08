import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
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
})
export class LoginComponent {
  readonly #fb = inject(FormBuilder);
  readonly #auth = inject(AuthService);

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
    if (this.form.invalid) return;

    this.#auth.login(this.email().value, this.password().value).subscribe({
      next: (user) => {
        console.log('Logged in:', user);
        alert(`Welcome`);
      },
      error: (err) => {
        console.error('Login failed:', err);
      },
    });
  }
}
