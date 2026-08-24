import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {
  toastService = inject(ToastService);

  serviceType: 'hvac' | 'electrical' | 'maintenance' = 'hvac';
  fullName: string = '';
  phone: string = '';
  address: string = '';
  issueDescription: string = '';

  selectedDate: number = 8;
  selectedTime: string = '11:30 AM';
  successModalVisible: boolean = false;

  readonly timeSlots = [
    { time: '09:00 AM', available: true },
    { time: '11:30 AM', available: true },
    { time: '02:00 PM', available: true },
    { time: '04:30 PM', available: false }
  ];

  selectServiceType(type: 'hvac' | 'electrical' | 'maintenance'): void {
    this.serviceType = type;
  }

  selectDate(day: number): void {
    this.selectedDate = day;
    this.toastService.info(`Fecha seleccionada: ${day} de Octubre`, undefined, 1500);
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
    this.successModalVisible = true;
    this.toastService.success('¡Cita Confirmada con Éxito!', `Oct ${this.selectedDate}, 2024 a las ${this.selectedTime}`);
  }

  closeModal(): void {
    this.successModalVisible = false;
  }
}

