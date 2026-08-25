import { Routes } from '@angular/router';
import { CLIMATECH_ROUTES } from './features/climatech/climatech.routes';
import { SMM_ROUTES } from './features/smm-layout/smm-layout.routes';
import { guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent), canActivate: [guestGuard] },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent), canActivate: [guestGuard] },
  ...CLIMATECH_ROUTES,
  { path: 'smm', children: SMM_ROUTES },
  { path: '**', redirectTo: '' }
];
