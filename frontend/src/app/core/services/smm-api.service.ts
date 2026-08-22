import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SmmService, SmmOrder, UserProfile } from '../models/smm.model';

@Injectable({ providedIn: 'root' })
export class SmmApiService {
  private baseUrl = 'http://localhost:3000/api/smm';

  constructor(private http: HttpClient) {}

  getServices(): Observable<SmmService[]> {
    return this.http.get<SmmService[]>(`${this.baseUrl}/services`).pipe(
      catchError(() => of([]))
    );
  }

  createOrder(order: Partial<SmmOrder>): Observable<SmmOrder> {
    return this.http.post<SmmOrder>(`${this.baseUrl}/orders`, order);
  }

  getOrders(): Observable<SmmOrder[]> {
    return this.http.get<SmmOrder[]>(`${this.baseUrl}/orders`).pipe(
      catchError(() => of([]))
    );
  }

  getBalance(): Observable<{ balance: number }> {
    return this.http.get<{ balance: number }>(`${this.baseUrl}/balance`).pipe(
      catchError(() => of({ balance: 0 }))
    );
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/profile`).pipe(
      catchError(() => of({ id: 0, username: '', balance: 0, apiKey: '' }))
    );
  }
}
