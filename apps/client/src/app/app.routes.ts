import type { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },

  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./users/profile/profile.component').then(
        (m) => m.ProfileComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
