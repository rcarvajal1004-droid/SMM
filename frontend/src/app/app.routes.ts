import { Routes } from '@angular/router';
import { ClimatechLayoutComponent } from './pages/layout/climatech-layout.component';
import { SmmLayoutComponent } from './features/smm-layout/smm-layout.component';
import { LandingComponent } from './features/landing/landing.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: ClimatechLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'hvac-services',
        loadComponent: () => import('./pages/hvac-services/hvac-services.component').then(m => m.HvacServicesComponent)
      },
      {
        path: 'electrical-services',
        loadComponent: () => import('./pages/electrical-services/electrical-services.component').then(m => m.ElectricalServicesComponent)
      },
      {
        path: 'booking',
        loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent)
      },
      {
        path: 'quote-tool',
        loadComponent: () => import('./pages/quote-tool/quote-tool.component').then(m => m.QuoteToolComponent)
      }
    ]
  },
  {
    path: 'smm',
    component: SmmLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'orders/new',
        loadComponent: () => import('./features/orders/pages/new-order/new-order.component').then(m => m.NewOrderComponent)
      },
      {
        path: 'orders/history',
        loadComponent: () => import('./features/orders/pages/order-history/order-history.component').then(m => m.OrderHistoryComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./features/services/services.component').then(m => m.ServicesComponent)
      },
      {
        path: 'add-funds',
        loadComponent: () => import('./features/add-funds/add-funds.component').then(m => m.AddFundsComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
