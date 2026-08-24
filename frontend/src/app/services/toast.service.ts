import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);
  private counter = 0;

  show(title: string, message?: string, type: 'success' | 'info' | 'warning' | 'error' = 'info', duration: number = 4000): void {
    const id = ++this.counter;
    const toast: Toast = { id, title, message, type, duration };
    
    this.toasts.update(current => [...current, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(title: string, message?: string, duration: number = 4000): void {
    this.show(title, message, 'success', duration);
  }

  info(title: string, message?: string, duration: number = 4000): void {
    this.show(title, message, 'info', duration);
  }

  warning(title: string, message?: string, duration: number = 4000): void {
    this.show(title, message, 'warning', duration);
  }

  error(title: string, message?: string, duration: number = 4000): void {
    this.show(title, message, 'error', duration);
  }

  remove(id: number): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
