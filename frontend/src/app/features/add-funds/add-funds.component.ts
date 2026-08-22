import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';
import { ConfettiService } from '../../core/services/confetti.service';

@Component({
  selector: 'app-add-funds',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-funds.component.html',
  styleUrl: './add-funds.component.css'
})
export class AddFundsComponent {
  amounts = [10, 25, 50, 100];

  constructor(private toast: ToastService, private confetti: ConfettiService) {}

  addFunds(amount: number) {
    this.confetti.smallCelebration();
    this.toast.success('Saldo Actualizado', `Se agregaron $${amount} a tu saldo`);
  }
}
