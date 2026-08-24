import { Component, inject, PLATFORM_ID, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import type { ChartData, ChartOptions, ChartType, TooltipItem } from 'chart.js';
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

export interface BrandSpec {
  brand: string;
  model: string;
  seer2: number;
  noiseDb: number;
  minTempC: number;
  coolingSpeedScore: number;  // 0-100
  smartScore: number;         // 0-100
  warrantyYears: number;
  costBenefitScore: number;   // 0-100
  color: string;
  borderColor: string;
}

export type CompareTab = 'seer2' | 'noise' | 'temp' | 'radar';

@Component({
  selector: 'app-hvac-services',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BaseChartDirective],
  templateUrl: './hvac-services.component.html',
  styleUrl: './hvac-services.component.css'
})
export class HvacServicesComponent implements OnDestroy {
  toastService = inject(ToastService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  currentYear = new Date().getFullYear();

  selectedCategory: 'residencial' | 'comercial' = 'residencial';
  searchTerm: string = '';
  activeTab: CompareTab = 'seer2';

  // Inverter Savings Calculator State
  dailyHours: number = 8;
  electricityRate: number = 3.2;

  get annualKwhSaved(): number {
    return Math.round(this.dailyHours * 365 * 0.6);
  }
  get annualMoneySaved(): number {
    return Math.round(this.annualKwhSaved * this.electricityRate);
  }
  get co2SavedKg(): number {
    return Math.round(this.annualKwhSaved * 0.45);
  }

  // ── Brand comparison data ─────────────────────────────────────
  readonly brands: BrandSpec[] = [
    {
      brand: 'Mirage',
      model: 'Titan Inverter 2024',
      seer2: 21.5,
      noiseDb: 19,
      minTempC: -15,
      coolingSpeedScore: 88,
      smartScore: 80,
      warrantyYears: 5,
      costBenefitScore: 85,
      color: 'rgba(0, 101, 145, 0.75)',
      borderColor: '#006591'
    },
    {
      brand: 'Prime',
      model: 'EliteStar Pro 2024',
      seer2: 20.0,
      noiseDb: 22,
      minTempC: -10,
      coolingSpeedScore: 82,
      smartScore: 92,
      warrantyYears: 3,
      costBenefitScore: 90,
      color: 'rgba(254, 166, 25, 0.75)',
      borderColor: '#fea619'
    },
    {
      brand: 'Carrier',
      model: 'Xpower Inverter 2024',
      seer2: 22.0,
      noiseDb: 21,
      minTempC: -15,
      coolingSpeedScore: 94,
      smartScore: 87,
      warrantyYears: 5,
      costBenefitScore: 78,
      color: 'rgba(16, 185, 129, 0.75)',
      borderColor: '#10b981'
    }
  ];

  readonly tabs: { id: CompareTab; label: string; icon: string }[] = [
    { id: 'seer2',  label: 'SEER2 — Eficiencia', icon: 'energy_savings_leaf' },
    { id: 'noise',  label: 'Ruido (dB)',           icon: 'volume_mute' },
    { id: 'temp',   label: 'Temp. Mínima',          icon: 'thermostat' },
    { id: 'radar',  label: 'Radar Global',           icon: 'radar' }
  ];

  // Which brand wins each metric (index into brands[])
  get bestSeer2(): number   { return this.brands.reduce((b,c,i,a) => a[i].seer2  > a[b].seer2  ? i : b, 0); }
  get bestNoise(): number   { return this.brands.reduce((b,c,i,a) => a[i].noiseDb < a[b].noiseDb ? i : b, 0); }
  get bestTemp(): number    { return this.brands.reduce((b,c,i,a) => a[i].minTempC < a[b].minTempC ? i : b, 0); }

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

  // ── Chart logic (ng2-charts, reactivo) ──────────────────────
  readonly barChartType: ChartType = 'bar';

  get barChartData(): ChartData<'bar'> {
    const cfg = this.barConfig[this.activeTab as Exclude<CompareTab, 'radar'>] ?? this.barConfig.seer2;
    const labels = this.brands.map(b => b.brand);
    return {
      labels,
      datasets: [{
        label: cfg.label,
        data: cfg.data,
        backgroundColor: (context) => {
          // Gradiente premium por barra (color de marca → transparente hacia abajo)
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return this.brands[context.dataIndex]?.color ?? '#006591';
          const brand = this.brands[context.dataIndex];
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, this.withAlpha(brand.borderColor, 0.25));
          gradient.addColorStop(1, this.withAlpha(brand.borderColor, 0.95));
          return gradient;
        },
        borderColor: this.brands.map(b => b.borderColor),
        borderWidth: 2,
        borderRadius: 12,
        borderSkipped: false,
        maxBarThickness: 72,
        hoverBackgroundColor: this.brands.map(b => b.borderColor)
      }]
    };
  }

  get barChartOptions(): ChartOptions<'bar'> {
    const cfg = this.barConfig[this.activeTab as Exclude<CompareTab, 'radar'>] ?? this.barConfig.seer2;
    const textColor = this.chartTextColor();
    const gridColor = this.chartGridColor();
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 900,
        easing: 'easeOutQuart',
        delay: (ctx) => (ctx.type === 'data' ? ctx.dataIndex * 150 : 0)
      },
      plugins: {
        legend: { display: false },
        tooltip: this.premiumTooltip((item) => ` ${item.parsed.y}${cfg.suffix}`)
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: textColor, font: { size: 13, family: 'Inter', weight: 600 }, padding: 8 }
        },
        y: {
          min: cfg.yMin,
          grid: { color: gridColor, drawTicks: false },
          border: { display: false },
          ticks: {
            color: textColor,
            font: { size: 12, family: 'Inter' },
            padding: 8,
            callback: (v) => `${v}${cfg.suffix}`
          }
        }
      }
    };
  }

  get radarChartData(): ChartData<'radar'> {
    return {
      labels: ['Eficiencia SEER2', 'Silencio', 'Frío Extremo', 'Vel. Enfría.', 'Smart Features', 'Costo-Beneficio'],
      datasets: this.brands.map(b => ({
        label: `${b.brand} — ${b.model}`,
        data: [
          this.normalize(b.seer2, 18, 24),
          this.normalize(40 - b.noiseDb, 10, 25),
          this.normalize(Math.abs(b.minTempC), 8, 18),
          b.coolingSpeedScore,
          b.smartScore,
          b.costBenefitScore
        ],
        backgroundColor: this.withAlpha(b.borderColor, 0.18),
        borderColor: b.borderColor,
        borderWidth: 2.5,
        pointBackgroundColor: b.borderColor,
        pointBorderColor: '#fff',
        pointBorderWidth: 1.5,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointHoverBorderWidth: 2
      }))
    };
  }

  get radarChartOptions(): ChartOptions<'radar'> {
    const textColor = this.chartTextColor();
    const gridColor = this.chartGridColor();
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900, easing: 'easeOutQuart' },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            padding: 18,
            usePointStyle: true,
            pointStyle: 'circle',
            font: { size: 12, family: 'Inter', weight: 600 }
          }
        },
        tooltip: this.premiumTooltip((item) => ` ${item.dataset.label}: ${(item.parsed as { r: number }).r.toFixed(0)}/100`)
      },
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { display: false, stepSize: 25 },
          grid: { color: gridColor },
          angleLines: { color: gridColor },
          pointLabels: { color: textColor, font: { size: 11, family: 'Inter', weight: 600 }, padding: 10 }
        }
      }
    };
  }

  /** Tooltip dark glass estilo dashboard premium */
  private premiumTooltip(labelFn: (item: TooltipItem<any>) => string): NonNullable<ChartOptions<any>['plugins']>['tooltip'] {
    return {
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      titleColor: '#e2e8f0',
      bodyColor: '#cbd5e1',
      borderColor: 'rgba(148, 163, 184, 0.25)',
      borderWidth: 1,
      cornerRadius: 12,
      padding: 12,
      usePointStyle: true,
      boxPadding: 6,
      titleFont: { family: 'Inter', size: 13, weight: 700 },
      bodyFont: { family: 'Inter', size: 12 },
      callbacks: { label: labelFn }
    };
  }

  private chartTextColor(): string {
    return this.isBrowser && document.documentElement.classList.contains('dark') ? '#94a3b8' : '#3e4850';
  }

  private chartGridColor(): string {
    return this.isBrowser && document.documentElement.classList.contains('dark')
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(0,0,0,0.05)';
  }

  /** Convierte hex #rrggbb a rgba con alpha */
  private withAlpha(hex: string, alpha: number): string {
    const m = hex.replace('#', '');
    const bigint = parseInt(m, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  setTab(tab: CompareTab): void {
    this.activeTab = tab;
  }

  ngOnDestroy(): void { /* ng2-charts destruye la instancia automáticamente */ }

  readonly barConfig: Record<Exclude<CompareTab, 'radar'>, { data: number[]; label: string; suffix: string; note: string; yMin: number }> = {
    seer2: {
      data: this.brands.map(b => b.seer2),
      label: 'SEER2 — Eficiencia Estacional',
      suffix: ' SEER2',
      note: '★ Mayor valor = mayor eficiencia energética',
      yMin: 18
    },
    noise: {
      data: this.brands.map(b => b.noiseDb),
      label: 'Nivel de Ruido en operación',
      suffix: ' dB',
      note: '★ Menor valor = funcionamiento más silencioso',
      yMin: 14
    },
    temp: {
      data: this.brands.map(b => b.minTempC),
      label: 'Temperatura Mínima de Operación',
      suffix: '°C',
      note: '★ Valor más negativo = opera en climas más extremos',
      yMin: -20
    }
  };

  /** Normaliza un valor a escala 0–100 dado un rango [min, max] */
  private normalize(value: number, min: number, max: number): number {
    return Math.round(((value - min) / (max - min)) * 100);
  }
}

