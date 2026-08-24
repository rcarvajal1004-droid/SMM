import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-surface/90 dark:bg-surface-container/90 backdrop-blur-xl border border-white/20 dark:border-outline-variant/30 shadow-2xl shadow-slate-900/20 transform transition-all duration-300 animate-fade-in-up"
          [ngClass]="{
            'border-l-4 border-l-primary': toast.type === 'info',
            'border-l-4 border-l-emerald-500': toast.type === 'success',
            'border-l-4 border-l-amber-500': toast.type === 'warning',
            'border-l-4 border-l-error': toast.type === 'error'
          }"
        >
          <!-- Icon -->
          <div class="flex-shrink-0 mt-0.5">
            @if (toast.type === 'success') {
              <span class="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
            } @else if (toast.type === 'error') {
              <span class="material-symbols-outlined text-error text-xl">error</span>
            } @else if (toast.type === 'warning') {
              <span class="material-symbols-outlined text-amber-500 text-xl">warning</span>
            } @else {
              <span class="material-symbols-outlined text-primary text-xl">info</span>
            }
          </div>

          <!-- Content -->
          <div class="flex-grow">
            <h4 class="font-label-md text-label-md font-bold text-on-surface">{{ toast.title }}</h4>
            @if (toast.message) {
              <p class="font-body-md text-body-md text-on-surface-variant text-sm mt-0.5">{{ toast.message }}</p>
            }
          </div>

          <!-- Close button -->
          <button (click)="toastService.remove(toast.id)" class="text-outline hover:text-on-surface transition-colors p-1" aria-label="Cerrar notificación">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}
