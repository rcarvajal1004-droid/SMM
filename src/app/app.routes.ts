import { Routes } from '@angular/router';

export const routes: Routes = [
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
  },
  { path: '**', redirectTo: '' }
];
