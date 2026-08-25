import { Injectable } from '@angular/core';
import { BUSINESS_CONTACT_LINKS } from '../../../core/config/business-contact.config';

export type QuoteServiceType = 'hvac' | 'electric';
export type QuoteUrgency = 'standard' | 'urgent' | 'planning';

@Injectable({ providedIn: 'root' })
export class QuoteFacade {
  getServiceLabel(serviceType: QuoteServiceType): string {
    return serviceType === 'hvac' ? 'Sistemas HVAC' : 'Servicios Eléctricos';
  }

  getUrgencyLabel(urgency: QuoteUrgency): string {
    const labels: Record<QuoteUrgency, string> = {
      standard: 'Estándar',
      urgent: 'Urgente',
      planning: 'Planificación'
    };
    return labels[urgency];
  }

  createWhatsAppUrl(serviceType: QuoteServiceType, propertyType: string, urgency: QuoteUrgency, description: string): string {
    let message = `Hola Refacciones aire acondicionado y venta de Minisplit SMM, me gustaría solicitar una cotización:\n\n`;
    message += `*Servicio:* ${this.getServiceLabel(serviceType)}\n`;
    message += `*Propiedad:* ${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}\n`;
    message += `*Urgencia:* ${this.getUrgencyLabel(urgency)}\n`;
    if (description.trim()) message += `*Detalles:* ${description.trim()}\n`;

    const baseUrl = BUSINESS_CONTACT_LINKS.whatsapp.split('?')[0];
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }
}
