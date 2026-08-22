import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmmApiService } from '../../../../core/services/smm-api.service';
import { SmmOrder } from '../../../../core/models/smm.model';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {
  orders: SmmOrder[] = [];
  compactView = false;
  copiedId: number | null = null;
  copiedLink: number | null = null;

  constructor(private api: SmmApiService) {}

  ngOnInit(): void {
    this.api.getOrders().subscribe(data => this.orders = data);
  }

  statusConfig(status: string) {
    switch (status) {
      case 'Completed':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: '✓', pulse: false };
      case 'Pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '●', pulse: true };
      case 'In progress':
        return { bg: 'bg-blue-100', text: 'text-blue-700', icon: '●', pulse: true };
      case 'Partial':
        return { bg: 'bg-orange-100', text: 'text-orange-700', icon: '⚠', pulse: false };
      case 'Canceled':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: '✕', pulse: false };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: '●', pulse: false };
    }
  }

  toggleView() {
    this.compactView = !this.compactView;
  }

  async copyToClipboard(text: string, type: 'id' | 'link', orderId: number) {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'id') {
        this.copiedId = orderId;
        setTimeout(() => this.copiedId = null, 1500);
      } else {
        this.copiedLink = orderId;
        setTimeout(() => this.copiedLink = null, 1500);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
}
