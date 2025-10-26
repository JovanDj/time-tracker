import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, type Observable } from 'rxjs';
import z from 'zod';
import { authSchema, type AuthSchema } from '../../auth/auth.schema';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  readonly #http = inject(HttpClient);

  list(): Observable<AuthSchema[]> {
    return this.#http.get<unknown>('/api/users').pipe(
      map((res) => {
        return z.array(authSchema).parse(res);
      }),
    );
  }
}
