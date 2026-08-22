import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SmmApiService } from '../../../../core/services/smm-api.service';
import { SmmService } from '../../../../core/models/smm.model';
import { selectedService, quantity, totalCost, hasEnoughBalance, quantityIsValid } from '../../data-access/order-calculator.store';
import { SmartLinkDirective, DetectedPlatform } from '../../../../shared/directives/smart-link.directive';
import { ToastService } from '../../../../core/services/toast.service';
import { ConfettiService } from '../../../../core/services/confetti.service';

@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [CommonModule, FormsModule, SmartLinkDirective],
  templateUrl: './new-order.component.html',
  styleUrl: './new-order.component.css'
})
export class NewOrderComponent {
  services: SmmService[] = [];
  selectedServiceId = '';
  qty = 0;
  detectedPlatform: DetectedPlatform | null = null;
  link = '';
  animatedCost = 0;
  private animationFrame?: number;

  constructor(
    private api: SmmApiService,
    private toast: ToastService,
    private confetti: ConfettiService
  ) {
    this.api.getServices().subscribe(data => this.services = data);
  }

  get activeService() {
    return this.services.find(s => s.id === Number(this.selectedServiceId)) || null;
  }

  totalCostValue = totalCost;

  canSubmit(): boolean {
    const service = this.activeService;
    if (!service || !this.qty) return false;
    return this.qty >= service.min && this.qty <= service.max && this.qty > 0;
  }

  onLinkDetected(platform: DetectedPlatform | null) {
    this.detectedPlatform = platform;
  }

  animateCounter(targetValue: number) {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    const startValue = this.animatedCost;
    const diff = targetValue - startValue;
    const duration = 500;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.animatedCost = startValue + diff * eased;

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(step);
      } else {
        this.animatedCost = targetValue;
      }
    };

    this.animationFrame = requestAnimationFrame(step);
  }

  onQuantityChange() {
    const cost = totalCost();
    this.animateCounter(cost);
  }

  submitOrder() {
    if (!this.canSubmit() || !this.activeService) return;

    const order = {
      serviceId: this.activeService.id,
      serviceName: this.activeService.name,
      link: this.link,
      quantity: this.qty,
      charge: totalCost()
    };

    this.api.createOrder(order).subscribe({
      next: () => {
        this.confetti.smallCelebration();
        this.toast.show('Orden Creada', `Orden #${Math.floor(Math.random() * 10000)} creada exitosamente`, {
          label: 'Ver Historial',
          onClick: () => {
            window.location.hash = '#/orders/history';
          }
        });
      },
      error: () => {
        this.toast.error('Error', 'No se pudo crear la orden');
      }
    });
  }
}

