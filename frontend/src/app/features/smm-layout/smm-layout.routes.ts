import { Routes } from '@angular/router';
import { SmmLayoutComponent } from './smm-layout.component';

export const SMM_ROUTES: Routes = [
  {
    path: '',
    component: SmmLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('../home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('../dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'orders/new',
        loadComponent: () => import('../orders/pages/new-order/new-order.component').then(m => m.NewOrderComponent)
      },
      {
        path: 'orders/history',
        loadComponent: () => import('../orders/pages/order-history/order-history.component').then(m => m.OrderHistoryComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('../services/services.component').then(m => m.ServicesComponent)
      },
      {
        path: 'add-funds',
        loadComponent: () => import('../add-funds/add-funds.component').then(m => m.AddFundsComponent)
      }
    ]
  }
];
