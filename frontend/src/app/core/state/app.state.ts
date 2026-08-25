import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { User, Order, Booking, Quote, Service, Payment, AuthResponse, CreateBookingRequest, CreateQuoteRequest } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AppState {
  private api = inject(ApiService);

  user = signal<User | null>(null);
  balance = signal<number>(0);
  orders = signal<Order[]>([]);
  bookings = signal<Booking[]>([]);
  quotes = signal<Quote[]>([]);
  services = signal<Service[]>([]);
  payments = signal<Payment[]>([]);
  loading = signal<Record<string, boolean>>({});

  isAuthenticated = computed(() => !!this.user());
  userDisplayName = computed(() => this.user()?.username || 'Guest');

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    if (typeof localStorage !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          this.user.set(JSON.parse(userStr));
        } catch {
          localStorage.removeItem('user');
        }
      }
    }
  }

  private setLoading(key: string, value: boolean) {
    this.loading.update((state) => ({ ...state, [key]: value }));
  }

  isLoading(key: string): boolean {
    return this.loading()[key] || false;
  }

  async login(identifier: string, password: string): Promise<AuthResponse | undefined> {
    this.setLoading('login', true);
    try {
      const res = await this.api.login({ identifier, password }).toPromise();
      if (res) {
        this.user.set(res.user);
        this.balance.set(res.user.balance);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(res.user));
        }
        return res;
      }
      return undefined;
    } finally {
      this.setLoading('login', false);
    }
  }

  async register(username: string, email: string, password: string): Promise<AuthResponse | undefined> {
    this.setLoading('register', true);
    try {
      const res = await this.api.register({ username, email, password }).toPromise();
      if (res) {
        this.user.set(res.user);
        this.balance.set(res.user.balance);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(res.user));
        }
        return res;
      }
      return undefined;
    } finally {
      this.setLoading('register', false);
    }
  }

  async logout() {
    this.setLoading('logout', true);
    try {
      await this.api.logout().toPromise();
    } finally {
      this.clearUser();
      this.setLoading('logout', false);
    }
  }

  clearUser() {
    this.user.set(null);
    this.balance.set(0);
    this.orders.set([]);
    this.bookings.set([]);
    this.quotes.set([]);
    this.payments.set([]);
    this.api.clearTokens();
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('user');
    }
  }

  async loadUserProfile() {
    if (!this.isAuthenticated()) return;
    this.setLoading('profile', true);
    try {
      const res = await this.api.getBalance().toPromise();
      if (res) {
        this.balance.set(res.balance);
        this.user.update((u) => (u ? { ...u, balance: res.balance } : null));
      }
    } finally {
      this.setLoading('profile', false);
    }
  }

  async loadOrders() {
    this.setLoading('orders', true);
    try {
      const res = await this.api.getOrders().toPromise();
      if (res) this.orders.set(res);
    } finally {
      this.setLoading('orders', false);
    }
  }

  async createOrder(data: { serviceId: number; link: string; quantity: number }) {
    this.setLoading('createOrder', true);
    try {
      const order = await this.api.createOrder(data).toPromise();
      if (order) {
        this.orders.update((list) => [order, ...list]);
        await this.loadUserProfile();
      }
      return order;
    } finally {
      this.setLoading('createOrder', false);
    }
  }

  async cancelOrder(id: number) {
    this.setLoading('cancelOrder', true);
    try {
      const order = await this.api.cancelOrder(id).toPromise();
      if (order) {
        this.orders.update((list) => list.map((o) => (o.id === id ? order : o)));
        await this.loadUserProfile();
      }
      return order;
    } finally {
      this.setLoading('cancelOrder', false);
    }
  }

  async loadBookings() {
    this.setLoading('bookings', true);
    try {
      const res = await this.api.getBookings().toPromise();
      if (res) this.bookings.set(res);
    } finally {
      this.setLoading('bookings', false);
    }
  }

  async createBooking(data: CreateBookingRequest) {
    this.setLoading('createBooking', true);
    try {
      const booking = await this.api.createBooking(data).toPromise();
      if (booking) {
        this.bookings.update((list) => [booking, ...list]);
      }
      return booking;
    } finally {
      this.setLoading('createBooking', false);
    }
  }

  async cancelBooking(id: number) {
    this.setLoading('cancelBooking', true);
    try {
      const booking = await this.api.cancelBooking(id).toPromise();
      if (booking) {
        this.bookings.update((list) => list.map((b) => (b.id === id ? booking : b)));
      }
      return booking;
    } finally {
      this.setLoading('cancelBooking', false);
    }
  }

  async loadQuotes() {
    this.setLoading('quotes', true);
    try {
      const res = await this.api.getQuotes().toPromise();
      if (res) this.quotes.set(res);
    } finally {
      this.setLoading('quotes', false);
    }
  }

  async createQuote(data: CreateQuoteRequest) {
    this.setLoading('createQuote', true);
    try {
      const quote = await this.api.createQuote(data).toPromise();
      if (quote) {
        this.quotes.update((list) => [quote, ...list]);
      }
      return quote;
    } finally {
      this.setLoading('createQuote', false);
    }
  }

  async loadServices() {
    this.setLoading('services', true);
    try {
      const res = await this.api.getServices().toPromise();
      if (res) this.services.set(res);
    } finally {
      this.setLoading('services', false);
    }
  }

  async loadPayments() {
    this.setLoading('payments', true);
    try {
      const res = await this.api.getPayments().toPromise();
      if (res) this.payments.set(res);
    } finally {
      this.setLoading('payments', false);
    }
  }

  async createPayment(data: { amount: number; provider: string; providerReference?: string }) {
    this.setLoading('createPayment', true);
    try {
      const payment = await this.api.createPayment(data).toPromise();
      if (payment) {
        this.payments.update((list) => [payment, ...list]);
      }
      return payment;
    } finally {
      this.setLoading('createPayment', false);
    }
  }
}