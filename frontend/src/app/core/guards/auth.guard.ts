import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const accessToken = typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : null;

  if (accessToken) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const accessToken = typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : null;

  if (!accessToken) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};