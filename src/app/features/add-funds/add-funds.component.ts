import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-funds',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-funds.component.html',
  styleUrl: './add-funds.component.css'
})
export class AddFundsComponent {
  amounts = [10, 25, 50, 100];
}
