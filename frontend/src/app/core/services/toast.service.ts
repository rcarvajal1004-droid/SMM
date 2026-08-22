import { Injectable, NgZone } from '@angular/core';
import { toast, ExternalToast } from 'ngx-sonner';

export interface CustomToast {
  id?: number;
  title: string;
  message?: string;
  action?: { label: string; onClick: (event: MouseEvent) => void };
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private ngZone: NgZone) {}

  show(title: string, message?: string, action?: { label: string; onClick: (event: MouseEvent) => void }) {
    this.ngZone.run(() => {
      const options: ExternalToast = {
        description: message,
        duration: 4000
      };
      
      if (action) {
        options.action = action;
      }
      
      toast(title, options);
    });
  }

  success(title: string, message?: string) {
    this.ngZone.run(() => {
      toast.success(title, { description: message });
    });
  }

  error(title: string, message?: string) {
    this.ngZone.run(() => {
      toast.error(title, { description: message });
    });
  }
}
