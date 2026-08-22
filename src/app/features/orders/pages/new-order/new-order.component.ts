import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SmmApiService } from '../../../../core/services/smm-api.service';
import { SmmService } from '../../../../core/models/smm.model';
import { selectedService, quantity, totalCost, hasEnoughBalance, quantityIsValid } from '../../data-access/order-calculator.store';

@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-order.component.html',
  styleUrl: './new-order.component.css'
})
export class NewOrderComponent {
  services: SmmService[] = [];
  selectedServiceId = '';
  qty = 0;

  constructor(private api: SmmApiService) {
    this.api.getServices().subscribe(data => this.services = data);
  }

  get activeService() {
    return this.services.find(s => s.id === Number(this.selectedServiceId)) || null;
  }

  totalCost = totalCost;

  canSubmit(): boolean {
    const service = this.activeService;
    if (!service || !this.qty) return false;
    return this.qty >= service.min && this.qty <= service.max && this.qty > 0;
  }
}
