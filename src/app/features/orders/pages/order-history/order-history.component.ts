import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmmApiService } from '../../../../core/services/smm-api.service';
import { SmmOrder } from '../../../../core/models/smm.model';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-background">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-on-surface mb-6">Historial de Órdenes</h1>
        <div class="bg-surface rounded-2xl border border-outline-variant overflow-hidden">
          <table class="w-full text-left">
            <thead class="bg-surface-container">
              <tr>
                <th class="px-6 py-4 text-sm font-medium text-on-surface-variant">ID</th>
                <th class="px-6 py-4 text-sm font-medium text-on-surface-variant">Servicio</th>
                <th class="px-6 py-4 text-sm font-medium text-on-surface-variant">Cantidad</th>
                <th class="px-6 py-4 text-sm font-medium text-on-surface-variant">Costo</th>
                <th class="px-6 py-4 text-sm font-medium text-on-surface-variant">Estado</th>
                <th class="px-6 py-4 text-sm font-medium text-on-surface-variant">Fecha</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/30">
              @for (order of orders; track order.id) {
                <tr class="hover:bg-surface-container/50">
                  <td class="px-6 py-4 text-sm text-on-surface">{{ order.id }}</td>
                  <td class="px-6 py-4 text-sm text-on-surface">{{ order.serviceName }}</td>
                  <td class="px-6 py-4 text-sm text-on-surface">{{ order.quantity }}</td>
                  <td class="px-6 py-4 text-sm text-on-surface">{{ order.charge | currency }}</td>
                  <td class="px-6 py-4">
                    <span class="inline-block px-3 py-1 rounded-full text-xs font-medium" [class]="statusClass(order.status)">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-on-surface-variant">{{ order.createdAt }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="px-6 py-8 text-center text-sm text-on-surface-variant">No hay órdenes registradas</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class OrderHistoryComponent implements OnInit {
  orders: SmmOrder[] = [];

  constructor(private api: SmmApiService) {}

  ngOnInit(): void {
    this.api.getOrders().subscribe(data => this.orders = data);
  }

  statusClass(status: string): string {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'In progress': return 'bg-blue-100 text-blue-700';
      case 'Partial': return 'bg-orange-100 text-orange-700';
      case 'Canceled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
