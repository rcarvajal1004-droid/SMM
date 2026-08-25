import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import type { ChartData, ChartOptions } from 'chart.js';
import { EquipmentCatalogService } from '../../data-access/equipment-catalog.service';
import { EquipmentCategory } from '../../models/equipment.model';

type ComparisonMetric = 'seer2' | 'noiseDb' | 'minTempC';

@Component({
  selector: 'app-equipment-comparison-preview',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective],
  templateUrl: './equipment-comparison-preview.component.html',
  styleUrl: './equipment-comparison-preview.component.css'
})
export class EquipmentComparisonPreviewComponent {
  private readonly catalog = inject(EquipmentCatalogService);

  category: EquipmentCategory | 'todos' = 'todos';
  metric: ComparisonMetric = 'seer2';

  readonly metricOptions: { id: ComparisonMetric; label: string; suffix: string }[] = [
    { id: 'seer2', label: 'Eficiencia SEER2', suffix: '' },
    { id: 'noiseDb', label: 'Ruido', suffix: ' dB' },
    { id: 'minTempC', label: 'Temperatura mínima', suffix: ' °C' }
  ];

  get visibleEquipment() {
    return this.catalog.byCategory(this.category);
  }

  get chartData(): ChartData<'bar'> {
    const option = this.metricOptions.find(item => item.id === this.metric) ?? this.metricOptions[0];
    return {
      labels: this.visibleEquipment.map(item => `${item.brand} ${item.btu / 1000}K`),
      datasets: [{
        label: option.label,
        data: this.visibleEquipment.map(item => item[this.metric]),
        backgroundColor: this.visibleEquipment.map(item => item.color),
        borderColor: this.visibleEquipment.map(item => item.borderColor),
        borderWidth: 2,
        borderRadius: 8,
        maxBarThickness: 42
      }]
    };
  }

  readonly chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#cbd5e1', maxRotation: 45, minRotation: 0 } },
      y: { grid: { color: 'rgba(255,255,255,0.08)' }, ticks: { color: '#cbd5e1' } }
    }
  };

  setCategory(category: EquipmentCategory | 'todos'): void {
    this.category = category;
  }

  setMetric(metric: ComparisonMetric): void {
    this.metric = metric;
  }
}
