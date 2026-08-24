import { Routes } from '@angular/router';
import { ClimatechLayoutComponent } from '../../layout/climatech/climatech-layout.component';

export const CLIMATECH_ROUTES: Routes = [
  {
    path: '',
    component: ClimatechLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'hvac-services', loadComponent: () => import('./pages/hvac-services/hvac-services.component').then(m => m.HvacServicesComponent) },
      { path: 'electrical-services', loadComponent: () => import('./pages/electrical-services/electrical-services.component').then(m => m.ElectricalServicesComponent) },
      { path: 'booking', loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent) },
      { path: 'quote-tool', loadComponent: () => import('./pages/quote-tool/quote-tool.component').then(m => m.QuoteToolComponent) },
      { path: 'diagnostico', loadComponent: () => import('./pages/diagnostic/diagnostic.component').then(m => m.DiagnosticComponent) }
      ,{ path: 'ayuda', loadComponent: () => import('./pages/help-center/help-center.component').then(m => m.HelpCenterComponent) }
    ]
  }
];