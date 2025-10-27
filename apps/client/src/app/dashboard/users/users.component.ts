import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  type OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import type { AuthSchema } from '../../auth/auth.schema';
import { ConfirmDeleteUserComponent } from './confirm-delete-user/confirm-delete-user.component';
import { UpdateUserFormComponent } from './update-user-form/update-user-form.component';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTableModule,
    NgIf,
    AsyncPipe,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  readonly #usersService = inject(UsersService);
  readonly #snack = inject(MatSnackBar);
  readonly #dialog = inject(MatDialog);
  readonly #destroyRef = inject(DestroyRef);

  protected readonly vm$ = this.#usersService.usersState();

  protected readonly displayedColumns = [
    'id',
    'email',
    'firstName',
    'lastName',
    'roleName',
    'actions',
  ];

  protected openEdit(user: AuthSchema) {
    const ref = this.#dialog.open(UpdateUserFormComponent, { data: user });
    ref.afterClosed().subscribe((changed) => {
      if (changed) {
        this.#snack.open('User updated', '', { duration: 2000 });
      }
    });
  }

  protected deleteUser(id: AuthSchema['id'], email: AuthSchema['email']) {
    const ref = this.#dialog.open(ConfirmDeleteUserComponent, {
      data: {
        title: 'Delete user?',
        message: `This will permanently delete user "${email}".`,
        confirmText: 'Delete',
      },
    });

    ref
      .afterClosed()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.#usersService.delete(id).subscribe(() => {
            this.#snack.open('User deleted', '', { duration: 2000 });
          });
        }
      });
  }
  ngOnInit(): void {
    this.#usersService
      .list()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe();
  }
}
