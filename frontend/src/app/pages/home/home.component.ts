import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  satisfactionPercent = 0;
  estimatedArrival = 45;

  ngOnInit(): void {
    this.animateCounters();
  }

  onMouseMove(e: MouseEvent, card: HTMLElement): void {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }

  private animateCounters(): void {
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= 100) {
        this.satisfactionPercent = 100;
        clearInterval(interval);
      } else {
        this.satisfactionPercent = current;
      }
    }, 20);
  }
}

