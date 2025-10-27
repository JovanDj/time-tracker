import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDeleteUserComponent } from './confirm-delete-user.component';

describe('ConfirmDeleteUserComponent', () => {
  let component: ConfirmDeleteUserComponent;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteUserComponent, MatDialogModule],
    });

    dialog = TestBed.inject(MatDialog);
    const dialogRef = dialog.open(ConfirmDeleteUserComponent);
    component = dialogRef.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
