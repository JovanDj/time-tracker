import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  type TemplateRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { catchError, type Observable, tap, throwError } from 'rxjs';
import type { AuthSchema } from '../../../auth/auth.schema';
import { AuthService } from '../../../auth/auth.service';
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
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  readonly #authService = inject(AuthService);
  readonly #dialog = inject(MatDialog);
  readonly #snack = inject(MatSnackBar);
  readonly #destroyRef = inject(DestroyRef);
  readonly #router = inject(Router);

  protected readonly vm$: Observable<AuthSchema | undefined> =
    this.#authService.userState();

  protected onEditProfile() {
    this.#dialog.open(UpdateProfileFormComponent);
  }

  protected onConfirmDelete(templateRef: TemplateRef<unknown>) {
    this.#dialog.open(templateRef, { id: 'confirmDelete' });
  }

  protected onDeleteAccount() {
    this.#authService
      .deleteAccount()
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        tap(() => {
          const dialogRef = this.#dialog.getDialogById('confirmDelete');
          dialogRef?.close();
          this.#router.navigate(['/']);
          this.#snack.open('Account deleted', '', { duration: 3000 });
        }),
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            this.#snack.open(err.message, '', { duration: 3000 });
          }

          return throwError(() => err);
        }),
      )
      .subscribe();
  }
}
