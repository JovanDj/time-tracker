import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserFormComponent } from './update-user-form.component';

describe('UpdateUserFormComponent', () => {
  let component: UpdateUserFormComponent;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateUserFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    dialog = TestBed.inject(MatDialog);

    const dialogRef = dialog.open(UpdateUserFormComponent, {
      data: { id: 1, firstName: 'John', lastName: 'Doe' },
    });
    component = dialogRef.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
