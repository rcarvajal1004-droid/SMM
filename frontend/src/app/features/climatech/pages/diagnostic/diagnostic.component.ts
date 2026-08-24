import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BUSINESS_CONTACT_LINKS } from '../../../../core/config/business-contact.config';

interface DiagnosticOption {
  id: string;
  label: string;
  icon: string;
  urgency: string;
  urgencyClass: string;
  causes: string[];
  recommendation: string;
}

@Component({
  selector: 'app-diagnostic',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './diagnostic.component.html',
  styleUrl: './diagnostic.component.css'
})
export class DiagnosticComponent {
  private readonly baseWhatsappUrl = BUSINESS_CONTACT_LINKS.whatsapp;
  readonly selectedId = signal<string | null>(null);

  readonly options: DiagnosticOption[] = [
    {
      id: 'no-enfria', label: 'No enfría', icon: 'ac_unit', urgency: 'Atención recomendada', urgencyClass: 'diagnostic-warning',
      causes: ['Filtro saturado o flujo de aire reducido', 'Bajo nivel de refrigerante', 'Falla en compresor o sensor'],
      recommendation: 'Evita forzar el equipo y solicita una revisión técnica para recuperar su rendimiento.'
    },
    {
      id: 'ruido', label: 'Hace ruido', icon: 'volume_up', urgency: 'Revisión prioritaria', urgencyClass: 'diagnostic-danger',
      causes: ['Aspas desbalanceadas o sueltas', 'Motor con desgaste', 'Vibración en la unidad exterior'],
      recommendation: 'Apaga el equipo si el ruido es metálico o aumenta; una revisión temprana evita daños mayores.'
    },
    {
      id: 'gotea', label: 'Gotea agua', icon: 'water_drop', urgency: 'Atención recomendada', urgencyClass: 'diagnostic-warning',
      causes: ['Drenaje obstruido', 'Charola desnivelada', 'Serpentín congelado por falta de flujo'],
      recommendation: 'Protege la zona cercana al equipo y agenda una limpieza o diagnóstico del drenaje.'
    },
    {
      id: 'no-enciende', label: 'No enciende', icon: 'power_settings_new', urgency: 'Atención prioritaria', urgencyClass: 'diagnostic-danger',
      causes: ['Alimentación eléctrica interrumpida', 'Control o tarjeta electrónica', 'Protección térmica activada'],
      recommendation: 'No manipules el cableado. Desconecta el equipo y solicita asistencia técnica.'
    },
    {
      id: 'consumo', label: 'Consume demasiado', icon: 'bolt', urgency: 'Optimización recomendada', urgencyClass: 'diagnostic-info',
      causes: ['Filtros y serpentines sucios', 'Equipo sobredimensionado o antiguo', 'Pérdida de eficiencia del sistema'],
      recommendation: 'Una medición de consumo y mantenimiento preventivo puede reducir el gasto energético.'
    }
  ];

  readonly selected = computed(() => this.options.find(option => option.id === this.selectedId()) ?? null);
  readonly whatsappUrl = computed(() => {
    const selected = this.selected();
    if (!selected) return this.baseWhatsappUrl;
    const message = `Hola SMM, mi aire acondicionado ${selected.label.toLowerCase()}. Me gustaría solicitar un diagnóstico.`;
    return `https://wa.me/528139109310?text=${encodeURIComponent(message)}`;
  });

  select(optionId: string): void {
    this.selectedId.set(optionId);
  }
}
