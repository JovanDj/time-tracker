import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, throwError, type Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #http = inject(HttpClient);

  register(email: string, password: string): Observable<unknown> {
    return this.#http
      .post<unknown>('http://localhost:3000/auth/register', {
        email,
        password,
      })
      .pipe(
        catchError((err) => {
          console.error('Register error:', err);

          return throwError(() => err);
        }),
      );
  }

  login(email: string, password: string): Observable<unknown> {
    return this.#http
      .post<unknown>('http://localhost:3000/auth/login', { email, password })
      .pipe(
        catchError((err) => {
          console.error('Login error:', err);
          return throwError(() => err);
        }),
      );
  }
}
