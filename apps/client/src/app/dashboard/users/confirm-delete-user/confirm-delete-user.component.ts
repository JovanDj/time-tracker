import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-user',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-delete-user.component.html',
  styleUrl: './confirm-delete-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeleteUserComponent {
  readonly #ref = inject(MatDialogRef<ConfirmDeleteUserComponent>);
  readonly data = inject<{
    title: string;
    message: string;
    confirmText?: string;
  }>(MAT_DIALOG_DATA);

  confirm() {
    this.#ref.close(true);
  }
}
