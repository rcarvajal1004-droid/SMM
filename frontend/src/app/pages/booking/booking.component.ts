import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {
  successModalVisible = false;
  selectedDate = 8;
  selectedTime = '11:30 AM';
  selectedTechnician: string | null = null;

  readonly technicians = [
    { id: 1, name: 'Carlos Méndez', specialty: 'HVAC', available: true },
    { id: 2, name: 'Ana Ruiz', specialty: 'Electricidad', available: true },
    { id: 3, name: 'Luis Torres', specialty: 'HVAC / Electricidad', available: false }
  ];

  readonly timeSlots = [
    { time: '09:00 AM', available: true },
    { time: '11:30 AM', available: true },
    { time: '02:00 PM', available: true },
    { time: '04:30 PM', available: false }
  ];

  readonly days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

  selectDate(day: number): void {
    this.selectedDate = day;
  }

  selectTime(time: string): void {
    this.selectedTime = time;
  }

  selectTechnician(id: number): void {
    this.selectedTechnician = this.selectedTechnician === String(id) ? null : String(id);
  }

  isSelectedTechnician(id: number): boolean {
    return this.selectedTechnician === String(id);
  }

  getSelectedTechnicianName(): string {
    if (!this.selectedTechnician) return 'Sin seleccionar';
    const tech = this.technicians.find(t => t.id === Number(this.selectedTechnician));
    return tech?.name || 'Sin seleccionar';
  }

  showModal(): void {
    this.successModalVisible = true;
  }

  hideModal(): void {
    this.successModalVisible = false;
  }
}
