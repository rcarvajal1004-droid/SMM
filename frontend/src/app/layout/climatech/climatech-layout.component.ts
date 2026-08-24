import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ToastComponent } from '../toast/toast.component';
import { BUSINESS_CONTACT_LINKS } from '../../core/config/business-contact.config';

@Component({
  selector: 'app-climatech-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastComponent],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
    <app-toast></app-toast>
    <a
      [href]="whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar a SMM por WhatsApp"
      title="Contactar por WhatsApp"
      class="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-[#052e16] shadow-xl shadow-[#25D366]/25 flex items-center justify-center hover:scale-110 hover:bg-[#20bd5a] transition-transform focus:ring-2 focus:ring-[#25D366] focus:outline-none"
    >
      <span class="material-symbols-outlined text-3xl" aria-hidden="true">chat</span>
    </a>
  `,
  styles: []
})
export class ClimatechLayoutComponent {
  readonly whatsappUrl = BUSINESS_CONTACT_LINKS.whatsapp;
}

