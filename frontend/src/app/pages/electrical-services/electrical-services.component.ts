import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-electrical-services',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './electrical-services.component.html',
  styleUrl: './electrical-services.component.css'
})
export class ElectricalServicesComponent {
  toastService = inject(ToastService);

  // 3-Phase Simulator State (in Amperes)
  phaseA: number = 42;
  phaseB: number = 38;
  phaseC: number = 40;

  get totalLoad(): number {
    return this.phaseA + this.phaseB + this.phaseC;
  }

  get phaseAPercent(): number {
    return this.totalLoad > 0 ? Math.round((this.phaseA / this.totalLoad) * 100) : 33;
  }

  get phaseBPercent(): number {
    return this.totalLoad > 0 ? Math.round((this.phaseB / this.totalLoad) * 100) : 33;
  }

  get phaseCPercent(): number {
    return this.totalLoad > 0 ? Math.round((this.phaseC / this.totalLoad) * 100) : 34;
  }

  get neutralCurrent(): number {
    const a = this.phaseA;
    const b = this.phaseB;
    const c = this.phaseC;
    const val = (a * a) + (b * b) + (c * c) - (a * b) - (b * c) - (c * a);
    return Math.round(Math.sqrt(Math.max(0, val)) * 10) / 10;
  }

  get balanceStatus(): { text: string; color: string; badgeClass: string } {
    const diff = Math.max(Math.abs(this.phaseA - this.phaseB), Math.abs(this.phaseB - this.phaseC), Math.abs(this.phaseC - this.phaseA));
    if (diff <= 6) {
      return {
        text: 'Balance Óptimo',
        color: 'emerald',
        badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
      };
    } else if (diff <= 16) {
      return {
        text: 'Desbalance Moderado',
        color: 'amber',
        badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
      };
    } else {
      return {
        text: 'Sobrecarga / Desbalance Crítico',
        color: 'red',
        badgeClass: 'bg-error/10 text-error border-error/30'
      };
    }
  }

  autoBalance(): void {
    const avg = Math.round(this.totalLoad / 3);
    this.phaseA = avg;
    this.phaseB = avg;
    this.phaseC = this.totalLoad - (avg * 2);
    this.toastService.success('Fases Balanceadas con Éxito', `Carga distribuida equitativamente en ~${avg}A por fase.`);
  }

  onMouseMove(e: MouseEvent, card: HTMLElement): void {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }
}

