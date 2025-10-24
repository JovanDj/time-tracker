import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UpdateProfileFormComponent } from './update-profile-form.component';

describe('UpdateProfileFormComponent', () => {
  let component: UpdateProfileFormComponent;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProfileFormComponent, MatDialogModule],

      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    dialog = TestBed.inject(MatDialog);
    const dialogRef = dialog.open(UpdateProfileFormComponent);
    component = dialogRef.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
