import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  type OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, tap, throwError } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-update-profile-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
  ],
  templateUrl: './update-profile-form.component.html',
  styleUrl: './update-profile-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateProfileFormComponent implements OnInit {
  readonly #authService = inject(AuthService);
  readonly #snack = inject(MatSnackBar);
  readonly #fb = inject(FormBuilder);
  readonly #dialogRef = inject(MatDialogRef<UpdateProfileFormComponent>);
  readonly #destroyRef = inject(DestroyRef);

  protected readonly form = this.#fb.nonNullable.group({
    firstName: [''],
    lastName: [''],
  });

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
        takeUntilDestroyed(this.#destroyRef),
        tap((user) => {
          this.#snack.open('Profile updated', '', { duration: 3000 });
          this.form.patchValue({
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
          });
          this.#dialogRef.close();
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

  ngOnInit() {
    this.#authService
      .userState()
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        tap((user) => {
          this.form.patchValue({
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
          });
        }),
      )
      .subscribe();
  }
}
