import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { ConfettiService } from '../../core/services/confetti.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {
  toastService = inject(ToastService);
  private confetti = inject(ConfettiService);

  serviceType: 'hvac' | 'electrical' | 'maintenance' = 'hvac';
  fullName: string = '';
  phone: string = '';
  address: string = '';
  issueDescription: string = '';

  selectedDate: number = 8;
  selectedTime: string = '11:30 AM';
  successModalVisible: boolean = false;
  isSubmitting: boolean = false;

  readonly currentYear = new Date().getFullYear();
  readonly monthName = new Date().toLocaleDateString('es-MX', { month: 'long' });
  readonly days = Array.from({ length: 12 }, (_, i) => i + 1);

  readonly timeSlots = [
    { time: '09:00 AM', available: true },
    { time: '11:30 AM', available: true },
    { time: '02:00 PM', available: true },
    { time: '04:30 PM', available: false }
  ];

  /** Progreso del wizard: datos (step 1) + fecha/hora (step 2) */
  get stepOneComplete(): boolean {
    return this.fullName.trim().length > 2 && this.phone.trim().length > 6;
  }

  get progressPercent(): number {
    return this.stepOneComplete ? 100 : 50;
  }

  selectServiceType(type: 'hvac' | 'electrical' | 'maintenance'): void {
    this.serviceType = type;
  }

  selectDate(day: number): void {
    this.selectedDate = day;
    this.toastService.info(`Fecha seleccionada: ${day} de ${this.monthName}`, undefined, 1500);
  }

  selectTime(time: string): void {
    this.selectedTime = time;
    this.toastService.info(`Horario seleccionado: ${time}`, undefined, 1500);
  }

  getServiceName(): string {
    switch (this.serviceType) {
      case 'hvac': return 'HVAC Repair';
      case 'electrical': return 'Electrical Issue';
      case 'maintenance': return 'Maintenance';
      default: return 'HVAC Repair';
    }
  }

  confirmBooking(): void {
    if (this.isSubmitting) return;
    if (!this.fullName.trim() || !this.phone.trim() || !this.address.trim()) {
      this.toastService.error('Faltan datos', 'Completa nombre, teléfono y dirección para confirmar.');
      return;
    }
    this.isSubmitting = true;
    setTimeout(() => {
      this.isSubmitting = false;
      this.successModalVisible = true;
      this.confetti.celebrate();
      this.toastService.success('¡Cita Confirmada con Éxito!', `${this.selectedDate} de ${this.monthName} ${this.currentYear} a las ${this.selectedTime}`);
    }, 800);
  }

  closeModal(): void {
    this.successModalVisible = false;
  }
}
