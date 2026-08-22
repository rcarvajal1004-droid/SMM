import { Injectable, NgZone } from '@angular/core';
import confetti from 'canvas-confetti';

@Injectable({ providedIn: 'root' })
export class ConfettiService {
  constructor(private ngZone: NgZone) {}

  celebrate(x = 0.5, y = 0.5) {
    this.ngZone.runOutsideAngular(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x, y },
        colors: ['#006591', '#de8712', '#0ea5e9', '#131b2e']
      });
    });
  }

  smallCelebration() {
    this.ngZone.runOutsideAngular(() => {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#006591', '#de8712']
      });
    });
  }
}
