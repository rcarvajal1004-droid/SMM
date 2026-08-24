import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';

interface Product {
  id: string;
  name: string;
  category: 'residencial' | 'comercial';
  badge: string;
  badgeType: 'primary' | 'secondary' | 'tertiary';
  image: string;
  description: string;
  btu: string;
  voltage: string;
  seer: string;
  feature: string;
  featureIcon: string;
}

@Component({
  selector: 'app-hvac-services',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './hvac-services.component.html',
  styleUrl: './hvac-services.component.css'
})
export class HvacServicesComponent {
  toastService = inject(ToastService);

  selectedCategory: 'residencial' | 'comercial' = 'residencial';
  searchTerm: string = '';

  // Inverter Savings Calculator State
  dailyHours: number = 8;
  electricityRate: number = 3.2; // $/kWh promedio

  get annualKwhSaved(): number {
    // A standard 12K BTU uses ~1.2 kW. Inverter saves ~50% (0.6 kW saved per hour)
    return Math.round(this.dailyHours * 365 * 0.6);
  }

  get annualMoneySaved(): number {
    return Math.round(this.annualKwhSaved * this.electricityRate);
  }

  get co2SavedKg(): number {
    return Math.round(this.annualKwhSaved * 0.45);
  }

  readonly products: Product[] = [
    {
      id: 'ecocool-12k',
      name: 'EcoCool Series 12K',
      category: 'residencial',
      badge: 'Inverter',
      badgeType: 'primary',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXLZ3uOuR81NLyZwHEQ_cB24JLl3fl9kqBb19rslXaeFlec0uT0dON_1qU9VD4o8EhLc9QoIHs0rbCp169uvGiHRvvQVP5PPP0kxlGy4B77MgmWMOVWWWSJ0HsiZonD0geqkwubfQDc6EmLO1gtvUDsp4I61ep2lBGdLrSC53iHtkCi8GMxNmrbRexoeHbL_xtuBOyDez0DckNt4Rp8aVqypcBOIHdXXHPAUj-TFaGEcG-vgKIIE-p',
      description: 'Minisplit Inverter de alta eficiencia. Ideal para recámaras y espacios medianos. Ahorro de energía de hasta 60%.',
      btu: '12,000 BTU',
      voltage: '220V',
      seer: 'SEER 18',
      feature: 'Ultra Silencioso',
      featureIcon: 'volume_mute'
    },
    {
      id: 'protech-24k',
      name: 'ProTech DualZone 24K',
      category: 'comercial',
      badge: 'Multi-Zone',
      badgeType: 'primary',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzDAi0be-x0aWP6IomdkERS3UKvD7Ha2NBPO5zQZNaxgyyuIfiBliQxkTLdr14N58lQ1t1tWM-OvqStVkyoc8hhjxLXJTp_SwuK63UcYQsqachSHc61UWr7JAFSyotyzeHvgpfXfZo_En-zCBjpbef88MMUM1U682AUuEu-Ksqw_cndJXTwui5vjTajG6j9ch77YEySWZBH--ayNk7jEpJVCz1E_NpRxnTaORJMgf25Y86wWSwZrRs',
      description: 'Sistema multi-zona para enfriar dos áreas independientes con una sola unidad condensadora exterior.',
      btu: '24,000 BTU',
      voltage: '220V',
      seer: 'SEER 21',
      feature: 'Smart Control',
      featureIcon: 'wifi'
    },
    {
      id: 'baseline-18k',
      name: 'BaseLine 18K',
      category: 'residencial',
      badge: 'Standard',
      badgeType: 'tertiary',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_9PTpPT-CdPuwAbfsLJaw-UTozF4KKxVkc864_jWuAOOzzEf_8zNKBK3aJZWzJdEt2BVruWZvGq9hDuuE-_xOmznzExmmqNXZCT7QzdWecSD02VNa0biAyk4BdWY0_bDHDImyL4nfWAUkK3vTlQFyaJ6wHLKPTwAxsc1lM9bAZX-Jp5WzVIdzBXgQl5ovxZnR7Gf4H5UGnjoIMQKce6btaCB6maMH0jsQrFNhYw2oZBhJ7tpmPM9g',
      description: 'Minisplit estándar confiable y duradero. Excelente relación costo-beneficio para enfriamiento rápido.',
      btu: '18,000 BTU',
      voltage: '110V / 220V',
      seer: 'Turbo Mode',
      feature: 'Filtro HEPA',
      featureIcon: 'filter_alt'
    }
  ];

  get filteredProducts(): Product[] {
    return this.products.filter(p => {
      const matchesCategory = p.category === this.selectedCategory;
      const matchesSearch = !this.searchTerm.trim() || 
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.btu.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  selectCategory(category: 'residencial' | 'comercial') {
    this.selectedCategory = category;
  }

  showInfoToast(productName: string) {
    this.toastService.info(`Información de ${productName}`, 'Asesor técnico disponible para resolver dudas.');
  }

  onMouseMove(e: MouseEvent, card: HTMLElement): void {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }
}

