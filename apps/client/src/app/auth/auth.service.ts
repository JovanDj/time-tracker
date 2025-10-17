import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  type Observable,
  throwError,
} from 'rxjs';
import { type AuthSchema, authSchema } from './auth.schema';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #http = inject(HttpClient);

  readonly #store = new BehaviorSubject<AuthSchema>({
    id: 0,
    createdAt: '',
    email: '',
    firstName: '',
    lastName: '',
    updatedAt: '',
    roleName: '',
  });

  readonly #userState = this.#store.asObservable();

  userState() {
    return this.#userState;
  }

  register(email: string, password: string): Observable<unknown> {
    return this.#http
      .post<unknown>('/api/auth/register', {
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
      .post<unknown>('/api/auth/login', { email, password })
      .pipe(
        map((res: unknown) => {
          const auth = authSchema.parse(res);
          this.#store.next({ ...auth });

          return auth;
        }),

        catchError((err) => {
          console.error('Login error:', err);
          return throwError(() => err);
        }),
      );
  }

  me(): Observable<AuthSchema> {
    return this.#http.get<unknown>('/api/auth/me').pipe(
      map((res: unknown) => {
        const auth = authSchema.parse(res);
        this.#store.next({ ...auth });

        return auth;
      }),
      catchError((err) => {
        console.error(err);
        return throwError(() => err);
      }),
    );
  }

  logout(): Observable<void> {
    return this.#http.delete<void>('/api/auth/logout', {});
  }

  forgotPassword(email: string): Observable<void> {
    return this.#http.post<void>('/api/auth/forgot-password', { email });
  }

  resetPassword(token: string, password: string): Observable<void> {
    return this.#http.post<void>('/api/auth/reset-password', {
      token,
      password,
    });
  }

  updateProfile(
    firstName: AuthSchema['firstName'],
    lastName: AuthSchema['lastName'],
  ) {
    return this.#http
      .patch<AuthSchema>('/api/auth/me', { firstName, lastName })
      .pipe(
        map((res) => {
          const auth = authSchema.parse(res);
          this.#store.next({ ...auth });

          return auth;
        }),
      );
  }
}
