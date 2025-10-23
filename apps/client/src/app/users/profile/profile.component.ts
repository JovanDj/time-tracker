import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { catchError, type Observable, take, tap, throwError } from 'rxjs';
import type { AuthSchema } from '../../auth/auth.schema';
import { AuthService } from '../../auth/auth.service';
import { UpdateProfileFormComponent } from '../update-profile-form/update-profile-form.component';
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
    MatIconModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
  readonly #snack = inject(MatSnackBar);
  readonly #dialog = inject(MatDialog);

  protected readonly vm$: Observable<AuthSchema> =
    this.#authService.userState();

  protected onEditProfile() {
    this.#dialog.open(UpdateProfileFormComponent);
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
