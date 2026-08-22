import { HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiKey = 'YOUR_API_KEY';
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('smm_api_key') || apiKey : apiKey;

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return next(authReq).pipe(
    catchError((error: any) => {
      if (error?.status === 401) {
        console.error('Unauthorized access');
      }
      return throwError(() => error);
    })
  );
};
