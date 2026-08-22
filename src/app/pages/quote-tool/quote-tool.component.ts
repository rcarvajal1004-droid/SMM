import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quote-tool',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quote-tool.component.html',
  styleUrl: './quote-tool.component.css'
})
export class QuoteToolComponent {
  currentStep = 1;
  totalSteps = 3;

  btuValue = 0;
  tonValue = 'Aprox. 0 Toneladas';

  calculateBTU(): void {
    const areaInput = document.getElementById('area') as HTMLInputElement;
    const peopleInput = document.getElementById('people') as HTMLInputElement;
    const sunSelect = document.getElementById('sun') as HTMLSelectElement;
    const btuValueDisplay = document.getElementById('btuValue');
    const tonValueDisplay = document.getElementById('tonValue');

    if (!areaInput || !peopleInput || !sunSelect || !btuValueDisplay || !tonValueDisplay) return;

    const area = parseFloat(areaInput.value) || 0;
    let people = parseInt(peopleInput.value) || 1;
    const sun = sunSelect.value;

    if (area === 0) {
      btuValueDisplay.textContent = '0';
      tonValueDisplay.textContent = 'Aprox. 0 Toneladas';
      return;
    }

    let btu = area * 600;
    if (people > 2) {
      btu += (people - 2) * 500;
    }
    if (sun === 'high') {
      btu *= 1.15;
    } else if (sun === 'low') {
      btu *= 0.90;
    }
    btu = Math.ceil(btu / 500) * 500;
    const tons = (btu / 12000).toFixed(1);
    btuValueDisplay.textContent = btu.toLocaleString();
    tonValueDisplay.textContent = `Aprox. ${tons} Toneladas`;
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateUI();
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateUI();
    }
  }

  submitQuote(): void {
    const summaryService = document.getElementById('summaryService');
    const summaryProperty = document.getElementById('summaryProperty');
    const summaryUrgency = document.getElementById('summaryUrgency');
    const description = document.getElementById('description') as HTMLTextAreaElement;

    const service = summaryService?.textContent || '';
    const property = summaryProperty?.textContent || '';
    const urgency = summaryUrgency?.textContent || '';
    const desc = description?.value || '';

    let message = `Hola ClimaTech, me gustaría solicitar una cotización:\n\n`;
    message += `*Servicio:* ${service}\n`;
    message += `*Propiedad:* ${property}\n`;
    message += `*Urgencia:* ${urgency}\n`;
    if (desc) message += `*Detalles:* ${desc}\n`;

    const whatsappNumber = "1234567890";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  private updateUI(): void {
    const progressBar = document.getElementById('progressBar');
    const stepIndicatorText = document.getElementById('stepIndicatorText');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const btnSubmit = document.getElementById('btnSubmit');

    if (progressBar) {
      progressBar.style.width = `${(this.currentStep / this.totalSteps) * 100}%`;
    }
    if (stepIndicatorText) {
      stepIndicatorText.textContent = `Paso ${this.currentStep} de ${this.totalSteps}`;
    }

    const label1 = document.getElementById('labelStep1');
    const label2 = document.getElementById('labelStep2');
    const label3 = document.getElementById('labelStep3');

    if (label1) label1.className = this.currentStep >= 1 ? 'text-primary transition-colors' : 'text-outline transition-colors';
    if (label2) label2.className = this.currentStep >= 2 ? 'text-primary transition-colors' : 'text-outline transition-colors';
    if (label3) label3.className = this.currentStep >= 3 ? 'text-primary transition-colors' : 'text-outline transition-colors';

    if (this.currentStep === 1) {
      if (btnPrev) btnPrev.classList.add('hidden');
      if (btnNext) btnNext.classList.remove('hidden');
      if (btnSubmit) btnSubmit.classList.add('hidden');
    } else if (this.currentStep === this.totalSteps) {
      if (btnPrev) btnPrev.classList.remove('hidden');
      if (btnNext) btnNext.classList.add('hidden');
      if (btnSubmit) btnSubmit.classList.remove('hidden');
      this.populateSummary();
    } else {
      if (btnPrev) btnPrev.classList.remove('hidden');
      if (btnNext) btnNext.classList.remove('hidden');
      if (btnSubmit) btnSubmit.classList.add('hidden');
    }

    const step1Div = document.getElementById('step1');
    const step2Div = document.getElementById('step2');
    const step3Div = document.getElementById('step3');

    [step1Div, step2Div, step3Div].forEach((el, index) => {
      if (index + 1 === this.currentStep) {
        el?.classList.remove('hidden');
        setTimeout(() => el?.classList.remove('opacity-0'), 50);
      } else {
        el?.classList.add('opacity-0');
        setTimeout(() => el?.classList.add('hidden'), 300);
      }
    });
  }

  private populateSummary(): void {
    const serviceType = document.querySelector('input[name="serviceType"]:checked') as HTMLInputElement;
    const propertyType = document.querySelector('input[name="propertyType"]:checked') as HTMLInputElement;
    const urgency = document.getElementById('urgency') as HTMLSelectElement;

    const urgencyMap: { [key: string]: string } = {
      'standard': 'Estándar',
      'urgent': 'Urgente',
      'planning': 'Planificación'
    };

    const summaryService = document.getElementById('summaryService');
    const summaryProperty = document.getElementById('summaryProperty');
    const summaryUrgency = document.getElementById('summaryUrgency');

    if (summaryService) summaryService.textContent = serviceType?.value === 'hvac' ? 'Sistemas HVAC' : 'Servicios Eléctricos';
    if (summaryProperty) summaryProperty.textContent = propertyType?.value || '';
    if (summaryUrgency) summaryUrgency.textContent = urgencyMap[urgency?.value || ''] || urgency?.value || '';
  }
}
