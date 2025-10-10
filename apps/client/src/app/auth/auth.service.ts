import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, type Observable, throwError } from 'rxjs';
import { type AuthSchema, authSchema } from './auth.schema';

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

  login(email: string, password: string): Observable<AuthSchema> {
    return this.#http
      .post<unknown>('http://localhost:3000/auth/login', { email, password })
      .pipe(
        map((res: unknown) => {
          return authSchema.parse(res);
        }),

        catchError((err) => {
          console.error('Login error:', err);
          return throwError(() => err);
        }),
      );
  }

  me() {
    return this.#http.get<unknown>('http://localhost:3000/auth/me').pipe(
      map((res: unknown) => {
        return authSchema.parse(res);
      }),
      catchError((err) => {
        console.error(err);
        return throwError(() => err);
      }),
    );
  }

  logout(): Observable<void> {
    return this.#http.delete<void>('http://localhost:3000/auth/logout', {});
  }
}
