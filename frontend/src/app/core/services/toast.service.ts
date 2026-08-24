import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private counter = 0;

  show(
    title: string,
    message?: string,
    typeOrAction: Toast['type'] | { label: string; onClick: (event: MouseEvent) => void } = 'info',
    duration = 4000
  ): void {
    const type = typeof typeOrAction === 'string' ? typeOrAction : 'info';
    const id = ++this.counter;
    this.toasts.update(current => [...current, { id, title, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  success(title: string, message?: string, duration = 4000): void {
    this.show(title, message, 'success', duration);
  }

  info(title: string, message?: string, duration = 4000): void {
    this.show(title, message, 'info', duration);
  }

  warning(title: string, message?: string, duration = 4000): void {
    this.show(title, message, 'warning', duration);
  }

  error(title: string, message?: string, duration = 4000): void {
    this.show(title, message, 'error', duration);
  }

  remove(id: number): void {
    this.toasts.update(current => current.filter(item => item.id !== id));
  }
}
