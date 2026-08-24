import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmmApiService } from '../smm/data-access/smm-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-background">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-on-surface mb-6">Dashboard</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-surface rounded-2xl border border-outline-variant p-6">
            <p class="text-sm text-on-surface-variant mb-1">Saldo Actual</p>
            <p class="text-3xl font-bold text-primary">{{ balance | currency }}</p>
          </div>
          <div class="bg-surface rounded-2xl border border-outline-variant p-6">
            <p class="text-sm text-on-surface-variant mb-1">Órdenes Totales</p>
            <p class="text-3xl font-bold text-on-surface">{{ totalOrders }}</p>
          </div>
          <div class="bg-surface rounded-2xl border border-outline-variant p-6">
            <p class="text-sm text-on-surface-variant mb-1">Gastado</p>
            <p class="text-3xl font-bold text-secondary">{{ totalSpent | currency }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  balance = 0;
  totalOrders = 0;
  totalSpent = 0;

  constructor(private api: SmmApiService) {
    this.api.getBalance().subscribe(res => this.balance = res.balance);
    this.api.getOrders().subscribe(orders => {
      this.totalOrders = orders.length;
      this.totalSpent = orders.reduce((sum, o) => sum + o.charge, 0);
    });
  }
}
