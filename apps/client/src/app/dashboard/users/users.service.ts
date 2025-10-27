import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, type Observable, tap } from 'rxjs';
import z from 'zod';
import { type AuthSchema, authSchema } from '../../auth/auth.schema';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  readonly #http = inject(HttpClient);

  readonly #store = new BehaviorSubject<AuthSchema[] | undefined>(undefined);
  readonly #usersState = this.#store.asObservable();

  usersState() {
    return this.#usersState;
  }

  list(): Observable<unknown> {
    return this.#http.get<unknown>('/api/users').pipe(
      tap((res) => {
        const users = z.array(authSchema).parse(res);
        this.#store.next([...users]);
      }),
    );
  }

  update(id: number, data: Partial<AuthSchema>): Observable<AuthSchema> {
    return this.#http.patch<unknown>(`/api/users/${id}`, data).pipe(
      map((res) => authSchema.parse(res)),
      tap((user) => {
        const users = this.#store.getValue();
        if (!users) {
          return;
        }

        const updated = users.map((u) => (u.id === user.id ? user : u));

        this.#store.next([...updated]);
      }),
    );
  }

  delete(id: number): Observable<void> {
    return this.#http.delete<void>(`/api/users/${id}`).pipe(
      tap(() => {
        const users = this.#store.getValue();
        if (!users) {
          return;
        }

        const remaining = users.filter((u) => u.id !== id);
        this.#store.next([...remaining]);
      }),
    );
  }
}
