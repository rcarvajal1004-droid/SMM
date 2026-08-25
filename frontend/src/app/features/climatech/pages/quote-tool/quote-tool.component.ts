import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../core/services/toast.service';
import { AnimationService } from '../../../../shared/services/animation.service';
import { BtuCalculatorService } from '../../data-access/btu-calculator.service';
import { QuoteFacade } from '../../data-access/quote.facade';

@Component({
  selector: 'app-quote-tool',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quote-tool.component.html',
  styleUrl: './quote-tool.component.css'
})
export class QuoteToolComponent {
  toastService = inject(ToastService);
  private animations = inject(AnimationService);
  private btuCalculator = inject(BtuCalculatorService);
  private quoteFacade = inject(QuoteFacade);

  // BTU Calculator State
  btuArea: number | null = 20;
  btuPeople: number = 2;
  btuSun: 'low' | 'normal' | 'high' = 'normal';
  btuCalculated: number = 12000;
  tonsCalculated: string = '1.0';

  // Multi-step Quote State
  currentStep: number = 1;
  totalSteps: number = 3;
  serviceType: 'hvac' | 'electric' = 'hvac';
  propertyType: 'residencial' | 'comercial' | 'industrial' = 'residencial';
  urgency: 'standard' | 'urgent' | 'planning' = 'standard';
  description: string = '';

  constructor() {
    this.calculateBTU();
  }

  setQuickArea(area: number): void {
    this.btuArea = area;
    this.calculateBTU();
    this.toastService.info(`Área ajustada a ${area} m²`, undefined, 1500);
  }

  calculateBTU(): void {
    const result = this.btuCalculator.calculate({ area: this.btuArea || 0, people: this.btuPeople, sunExposure: this.btuSun });
    const from = this.btuCalculated;
    this.animations.countUp(from, result.btu, 0.6, (v) => {
      const rounded = Math.round(v / 100) * 100;
      this.btuCalculated = rounded;
      this.tonsCalculated = result.btu === 0 ? '0' : (rounded / 12000).toFixed(1);
    });
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  getServiceLabel(): string {
    return this.quoteFacade.getServiceLabel(this.serviceType);
  }

  getUrgencyLabel(): string {
    return this.quoteFacade.getUrgencyLabel(this.urgency);
  }

  submitQuote(): void {
    this.toastService.success('Cotización Generada', 'Redirigiendo a WhatsApp para conectar con un técnico...');
    const whatsappUrl = this.quoteFacade.createWhatsAppUrl(this.serviceType, this.propertyType, this.urgency, this.description);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
}


