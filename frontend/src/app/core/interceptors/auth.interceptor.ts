import { HttpInterceptorFn, HttpEvent, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError, BehaviorSubject, from, Observable } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const toastService = inject(ToastService);

  const accessToken = typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : null;
  const refreshToken = typeof localStorage !== 'undefined' ? localStorage.getItem('refresh_token') : null;

  const authReq = addAuthHeader(req, accessToken);

  return next(authReq).pipe(
    catchError((error: any) => {
      if (error?.status === 401 && !req.url.includes('/auth/refresh') && !req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
        return handle401Error(req, next, toastService, refreshToken);
      }

      if (error?.status === 0) {
        toastService.error('Network error. Please check your connection.');
      } else if (error?.status >= 500) {
        toastService.error('Server error. Please try again later.');
      } else if (error?.error?.error) {
        toastService.error(error.error.error);
      }

      return throwError(() => error);
    })
  );
};

function addAuthHeader(req: HttpRequest<unknown>, token: string | null) {
  if (!token) return req;
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

function handle401Error(req: HttpRequest<unknown>, next: HttpHandlerFn, toastService: ToastService, refreshToken: string | null): Observable<HttpEvent<unknown>> {
  if (!refreshToken) {
    clearAuthData();
    toastService.error('Session expired. Please log in again.');
    return throwError(() => new Error('No refresh token'));
  }

  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return from(refreshAccessToken(refreshToken)).pipe(
      switchMap((newAccessToken: string) => {
        isRefreshing = false;
        refreshTokenSubject.next(newAccessToken);
        return next(addAuthHeader(req, newAccessToken));
      }),
      catchError((err) => {
        isRefreshing = false;
        clearAuthData();
        toastService.error('Session expired. Please log in again.');
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next(addAuthHeader(req, token!)))
    );
  }
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) throw new Error('Refresh failed');

  const data = await response.json();
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('access_token', data.accessToken);
    if (data.refreshToken) localStorage.setItem('refresh_token', data.refreshToken);
  }
  return data.accessToken;
}

function clearAuthData() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
}
