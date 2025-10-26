import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
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
export class UsersComponent {
  readonly #usersService = inject(UsersService);

  protected readonly vm$ = this.#usersService.list();

  protected readonly displayedColumns = [
    'id',
    'email',
    'first_name',
    'last_name',
    'roleName',
    'actions',
  ];
}
