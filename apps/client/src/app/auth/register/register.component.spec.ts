import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AuthService } from '../auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let usernameInput: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        AuthService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    fixture.autoDetectChanges();

    usernameInput = fixture.debugElement.query(
      By.css('[data-test="email-input"]'),
    ).nativeElement as HTMLInputElement;
  });

  it('should disable button when form is invalid', () => {
    const submitButton = fixture.debugElement.query(
      By.css('[data-test="submit-btn"]'),
    ).nativeElement as HTMLButtonElement;

    expect(submitButton.disabled).toBeTruthy();
  });

  it('should show "Email is required" when user focuses and blurs email input without typing', () => {
    usernameInput.dispatchEvent(new Event('blur'));

    const errorElement = fixture.debugElement.query(By.css('mat-error'))
      .nativeElement as HTMLElement;

    expect(errorElement.textContent).toBe('Email is required');
  });

  it('should not show "Email is required" when user types a valid email', () => {
    usernameInput.value = 'john';
    usernameInput.dispatchEvent(new Event('input'));

    const errorElement = fixture.debugElement.query(By.css('mat-error'));

    expect(errorElement).toBeFalsy();
  });
});
