import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import type { Observable } from 'rxjs';
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
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  readonly #authService = inject(AuthService);
  readonly #dialog = inject(MatDialog);

  protected readonly vm$: Observable<AuthSchema> =
    this.#authService.userState();

  protected onEditProfile() {
    this.#dialog.open(UpdateProfileFormComponent);
  }
}
