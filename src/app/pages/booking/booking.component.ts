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

  showModal(): void {
    this.successModalVisible = true;
  }

  hideModal(): void {
    this.successModalVisible = false;
  }
}
