import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { take } from 'rxjs';
import type { AuthSchema } from '../../../auth/auth.schema';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-update-user-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './update-user-form.component.html',
  styleUrl: './update-user-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateUserFormComponent {
  readonly #ref = inject(MatDialogRef<UpdateUserFormComponent>);
  readonly #users = inject(UsersService);
  readonly data: AuthSchema = inject<AuthSchema>(MAT_DIALOG_DATA);

  protected readonly form = inject(FormBuilder).group({
    firstName: [this.data.firstName ?? ''],
    lastName: [this.data.lastName ?? ''],
  });

  protected save() {
    if (this.form.invalid) {
      return;
    }

    this.#users
      .update(this.data.id, {
        firstName: this.form.controls.firstName.value,
        lastName: this.form.controls.lastName.value,
      })
      .pipe(take(1))
      .subscribe(() => this.#ref.close(true));
  }

  protected close() {
    this.#ref.close(false);
  }
}
