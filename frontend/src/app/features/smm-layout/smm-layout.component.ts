import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  selector: 'app-smm-layout',
  standalone: true,
  imports: [RouterOutlet, NgxSonnerToaster],
  template: `
    <div class="min-h-screen bg-background">
      <router-outlet></router-outlet>
    </div>
    <ngx-sonner-toaster position="bottom-right" richColors closeButton></ngx-sonner-toaster>
  `,
  styles: []
})
export class SmmLayoutComponent {}
