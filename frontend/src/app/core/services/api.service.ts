import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshRequest,
  Service,
  Order,
  CreateOrderRequest,
  BalanceResponse,
  AddFundsRequest,
  Payment,
  CreatePaymentRequest,
  Booking,
  CreateBookingRequest,
  Quote,
  CreateQuoteRequest,
  ApiError,
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = '/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastService
  ) {}

  private handleError = (error: any): Observable<never> => {
    const apiError: ApiError = error?.error;
    const message = apiError?.error || 'An error occurred';
    this.toast.error(message);
    return throwError(() => error);
  };

  setTokens(accessToken: string, refreshToken: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  clearTokens() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  getAccessToken(): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : null;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Auth endpoints
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, data).pipe(
      tap((res) => this.setTokens(res.accessToken, res.refreshToken)),
      catchError(this.handleError)
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, data).pipe(
      tap((res) => this.setTokens(res.accessToken, res.refreshToken)),
      catchError(this.handleError)
    );
  }

  refresh(refreshToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/refresh`, { refreshToken }).pipe(
      tap((res) => this.setTokens(res.accessToken, res.refreshToken)),
      catchError(this.handleError)
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/auth/logout`, {}).pipe(
      tap(() => this.clearTokens()),
      catchError(this.handleError)
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/auth/change-password`, { currentPassword, newPassword }).pipe(
      catchError(this.handleError)
    );
  }

  // SMM Services
  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.baseUrl}/smm/services`).pipe(catchError(this.handleError));
  }

  getService(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.baseUrl}/smm/services/${id}`).pipe(catchError(this.handleError));
  }

  createService(data: Partial<Service>): Observable<Service> {
    return this.http.post<Service>(`${this.baseUrl}/smm/services`, data).pipe(catchError(this.handleError));
  }

  updateService(id: number, data: Partial<Service>): Observable<Service> {
    return this.http.patch<Service>(`${this.baseUrl}/smm/services/${id}`, data).pipe(catchError(this.handleError));
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/smm/services/${id}`).pipe(catchError(this.handleError));
  }

  // SMM Orders
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/smm/orders`).pipe(catchError(this.handleError));
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/smm/orders/${id}`).pipe(catchError(this.handleError));
  }

  createOrder(data: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/smm/orders`, data).pipe(catchError(this.handleError));
  }

  cancelOrder(id: number): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/smm/orders/${id}/cancel`, {}).pipe(catchError(this.handleError));
  }

  // SMM Balance
  getBalance(): Observable<BalanceResponse> {
    return this.http.get<BalanceResponse>(`${this.baseUrl}/smm/balance`).pipe(catchError(this.handleError));
  }

  addFunds(data: AddFundsRequest): Observable<BalanceResponse> {
    return this.http.post<BalanceResponse>(`${this.baseUrl}/smm/balance/add`, data).pipe(catchError(this.handleError));
  }

  // SMM Payments
  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/smm/payments`).pipe(catchError(this.handleError));
  }

  createPayment(data: CreatePaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}/smm/payments`, data).pipe(catchError(this.handleError));
  }

  approvePayment(id: number): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}/smm/payments/${id}/approve`, {}).pipe(catchError(this.handleError));
  }

  rejectPayment(id: number): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}/smm/payments/${id}/reject`, {}).pipe(catchError(this.handleError));
  }

  refundPayment(id: number): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}/smm/payments/${id}/refund`, {}).pipe(catchError(this.handleError));
  }

  // Climatech Booking
  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/climatech/booking`).pipe(catchError(this.handleError));
  }

  getBooking(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.baseUrl}/climatech/booking/${id}`).pipe(catchError(this.handleError));
  }

  createBooking(data: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(`${this.baseUrl}/climatech/booking`, data).pipe(catchError(this.handleError));
  }

  cancelBooking(id: number): Observable<Booking> {
    return this.http.post<Booking>(`${this.baseUrl}/climatech/booking/${id}/cancel`, {}).pipe(catchError(this.handleError));
  }

  // Climatech Quotes
  getQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(`${this.baseUrl}/climatech/quotes`).pipe(catchError(this.handleError));
  }

  getQuote(id: number): Observable<Quote> {
    return this.http.get<Quote>(`${this.baseUrl}/climatech/quotes/${id}`).pipe(catchError(this.handleError));
  }

  createQuote(data: CreateQuoteRequest): Observable<Quote> {
    return this.http.post<Quote>(`${this.baseUrl}/climatech/quotes`, data).pipe(catchError(this.handleError));
  }

  updateQuoteStatus(id: number, status: string): Observable<Quote> {
    return this.http.post<Quote>(`${this.baseUrl}/climatech/quotes/${id}/status`, { status }).pipe(catchError(this.handleError));
  }
}