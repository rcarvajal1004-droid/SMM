import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { AnimationService } from '../../shared/services/animation.service';

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

  // BTU Calculator State
  btuArea: number | null = 20;
  btuPeople: number = 2;
  btuSun: 'low' | 'normal' | 'high' = 'normal';
  btuCalculated: number = 12000;
  tonsCalculated: string = '1.0';
  private btuTarget: number = 12000;

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
    const area = this.btuArea || 0;
    if (area <= 0) {
      this.btuCalculated = 0;
      this.tonsCalculated = '0';
      return;
    }

    let btu = area * 600;
    if (this.btuPeople > 2) {
      btu += (this.btuPeople - 2) * 500;
    }
    if (this.btuSun === 'high') {
      btu *= 1.15;
    } else if (this.btuSun === 'low') {
      btu *= 0.90;
    }

    btu = Math.ceil(btu / 500) * 500;
    this.btuTarget = btu;
    // Transición numérica animada (no salto brusco)
    const from = this.btuCalculated;
    this.animations.countUp(from, btu, 0.6, (v) => {
      const rounded = Math.round(v / 100) * 100;
      this.btuCalculated = rounded;
      this.tonsCalculated = (rounded / 12000).toFixed(1);
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
    return this.serviceType === 'hvac' ? 'Sistemas HVAC' : 'Servicios Eléctricos';
  }

  getUrgencyLabel(): string {
    const urgencyMap: Record<string, string> = {
      standard: 'Estándar',
      urgent: 'Urgente',
      planning: 'Planificación'
    };
    return urgencyMap[this.urgency] || 'Estándar';
  }

  submitQuote(): void {
    let message = `Hola ClimaTech, me gustaría solicitar una cotización:\n\n`;
    message += `*Servicio:* ${this.getServiceLabel()}\n`;
    message += `*Propiedad:* ${this.propertyType.charAt(0).toUpperCase() + this.propertyType.slice(1)}\n`;
    message += `*Urgencia:* ${this.getUrgencyLabel()}\n`;
    if (this.description.trim()) {
      message += `*Detalles:* ${this.description.trim()}\n`;
    }

    this.toastService.success('Cotización Generada', 'Redirigiendo a WhatsApp para conectar con un técnico...');

    const whatsappNumber = "1234567890";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }
}


