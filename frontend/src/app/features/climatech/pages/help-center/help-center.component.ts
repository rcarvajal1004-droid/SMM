import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface TechnicalGuide {
  title: string;
  icon: string;
  summary: string;
  details: string[];
}

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './help-center.component.html',
  styleUrl: './help-center.component.css'
})
export class HelpCenterComponent {
  readonly openGuide = signal<string | null>(null);
  readonly checklist = signal([
    { label: 'Marca y modelo del equipo', checked: false },
    { label: 'Síntoma y desde cuándo ocurre', checked: false },
    { label: 'Fotografías del equipo o instalación', checked: false },
    { label: 'Ubicación y horario preferido', checked: false }
  ]);

  readonly guides: TechnicalGuide[] = [
    {
      title: '¿Qué capacidad de minisplit necesito?', icon: 'straighten',
      summary: 'La capacidad depende del área, altura, personas y exposición solar.',
      details: ['Usa la calculadora de BTU como estimación inicial.', 'Un espacio con sol directo requiere mayor capacidad.', 'La instalación y el aislamiento influyen en el rendimiento.']
    },
    {
      title: 'Inverter vs. convencional', icon: 'energy_savings_leaf',
      summary: 'Un equipo inverter regula su velocidad y evita arranques constantes.',
      details: ['Inverter suele consumir menos en uso prolongado.', 'Es recomendable para habitaciones o negocios con uso frecuente.', 'La capacidad correcta importa tanto como la tecnología.']
    },
    {
      title: 'Mantenimiento preventivo', icon: 'build',
      summary: 'La limpieza periódica conserva el flujo de aire y reduce el consumo.',
      details: ['Limpia filtros con frecuencia según el uso y el polvo del entorno.', 'Programa mantenimiento técnico antes de la temporada de mayor demanda.', 'No uses químicos ni abras la unidad eléctrica sin capacitación.']
    },
    {
      title: 'Señales de riesgo eléctrico', icon: 'warning',
      summary: 'Calentamiento, olor a quemado, chispas o apagones repetidos requieren atención.',
      details: ['Desconecta la carga si hacerlo es seguro.', 'No manipules tableros, cables expuestos ni protecciones.', 'Solicita revisión profesional ante cualquier olor a quemado o chispa.']
    }
  ];

  toggleGuide(title: string): void {
    this.openGuide.update(current => current === title ? null : title);
  }

  toggleChecklist(index: number): void {
    this.checklist.update(items => items.map((item, itemIndex) => itemIndex === index ? { ...item, checked: !item.checked } : item));
  }
}