import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SmmService } from '../../core/models/smm.model';

@Component({
  selector: 'app-spotlight',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './spotlight.component.html',
  styleUrl: './spotlight.component.css'
})
export class SpotlightComponent {
  @Input() services: SmmService[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() serviceSelected = new EventEmitter<SmmService>();

  query = '';
  selectedIndex = 0;
  filteredServices: SmmService[] = [];

  constructor(private router: Router) {}

  @HostListener('keydown.arrowdown')
  onArrowDown() {
    if (this.filteredServices.length === 0) return;
    this.selectedIndex = (this.selectedIndex + 1) % this.filteredServices.length;
  }

  @HostListener('keydown.arrowup')
  onArrowUp() {
    if (this.filteredServices.length === 0) return;
    this.selectedIndex = (this.selectedIndex - 1 + this.filteredServices.length) % this.filteredServices.length;
  }

  @HostListener('keydown.enter')
  onEnter() {
    if (this.filteredServices[this.selectedIndex]) {
      this.selectService(this.filteredServices[this.selectedIndex]);
    }
  }

  @HostListener('keydown.escape')
  onEscape() {
    this.close.emit();
  }

  onQueryChange() {
    const q = this.query.toLowerCase().trim();
    if (!q) {
      this.filteredServices = this.services.slice(0, 10);
    } else {
      this.filteredServices = this.services
        .filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q))
        .slice(0, 10);
    }
    this.selectedIndex = 0;
  }

  selectService(service: SmmService) {
    this.serviceSelected.emit(service);
    this.close.emit();
    this.router.navigate(['/orders/new']);
  }
}
