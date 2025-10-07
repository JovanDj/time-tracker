import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #http = inject(HttpClient);

  register(email: string, password: string) {
    return this.#http
      .post<unknown>('http://localhost:3000/auth/register', {
        email,
        password,
      })
      .pipe(catchError((err) => throwError(() => err)));
  }
}
