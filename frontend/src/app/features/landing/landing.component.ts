import { Component, OnInit, OnDestroy, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConfettiService } from '../../core/services/confetti.service';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

interface ServiceFeature {
  icon: string;
  title: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
  open: boolean;
}

interface SocialNetwork {
  id: string;
  name: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit, OnDestroy {
  private confetti = inject(ConfettiService);
  private el = inject(ElementRef);

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkCounterVisibility();
  }

  private observer?: IntersectionObserver;
  countersAnimated = false;

  readonly socialNetworks: SocialNetwork[] = [
    { id: 'instagram', name: 'Instagram', icon: '📷', color: '#E1306C' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#00f2ea' },
    { id: 'youtube', name: 'YouTube', icon: '▶️', color: '#FF0000' },
    { id: 'telegram', name: 'Telegram', icon: '✈️', color: '#0088cc' },
    { id: 'spotify', name: 'Spotify', icon: '🎧', color: '#1DB954' }
  ];

  readonly stats: StatItem[] = [
    { value: 10, suffix: 'M+', label: 'Órdenes Procesadas' },
    { value: 99.9, suffix: '%', label: 'Uptime Garantizado' },
    { value: 1, suffix: 's', label: 'Tiempo de Respuesta' },
    { value: 5000, suffix: '+', label: 'Revendedores Activos' }
  ];

  readonly services: ServiceFeature[] = [
    { icon: '⚡', title: 'Procesamiento Automático', description: 'Tus pedidos se procesan en segundos, sin intervención manual.' },
    { icon: '🔌', title: 'API REST', description: 'Integra nuestros servicios directamente en tu plataforma.' },
    { icon: '🛡️', title: 'Soporte 24/7', description: 'Equipo dedicado disponible en cualquier momento.' },
    { icon: '💳', title: 'Múltiples Métodos de Pago', description: 'Paga con tarjeta, transferencia o criptomonedas.' }
  ];

  readonly faqs: FAQItem[] = [
    { question: '¿Cómo funciona la API de SMM?', answer: 'Nuestra API REST te permite automatizar tus pedidos. Solo necesitas tu clave API, hacer una petición POST con el servicio, link y cantidad, y recibirás el ID de la orden. Consulta la documentación completa para endpoints y parámetros.', open: false },
    { question: '¿Qué métodos de pago aceptan?', answer: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard), transferencias bancarias, PayPal y criptomonedas (Bitcoin, Ethereum, USDT). Todos los pagos son procesados de forma segura.', open: false },
    { question: '¿Cuánto tarda la entrega?', answer: 'La mayoría de los pedidos comienzan en 0-30 minutos. Los tiempos varían según el servicio elegido, la red social y la cantidad solicitada. Los servicios premium ofrecen entrega instantánea.', open: false },
    { question: '¿Ofrecen programa de revendedores?', answer: 'Sí, contamos con un programa de revendedores con precios mayoristas exclusivos, panel de gestión completo y soporte prioritario. Regístrate como revendedor para acceder a tarifas especiales.', open: false },
    { question: '¿Es seguro comprar seguidores y likes?', answer: 'Utilizamos métodos orgánicos y de alta calidad que no comprometen la seguridad de tus cuentas. Todos nuestros servicios cumplen con las políticas de las plataformas y no usan bots de baja calidad.', open: false },
    { question: '¿Puedo cancelar un pedido?', answer: 'Los pedidos en proceso no se pueden cancelar. Sin embargo, ofrecemos garantía de reposición si los seguidores o interacciones disminuyen en los primeros 30 días.', open: false }
  ];

  selectedNetwork: SocialNetwork | null = null;
  followers = 1000;
  deliverySpeed: 'normal' | 'fast' | 'instant' = 'normal';
  estimatedTime = '2-4 horas';
  estimatedPrice = '0.00';
  savings = '0.00';

  readonly currentYear = new Date().getFullYear();

  readonly pricingRates: Record<string, number> = {
    instagram: 0.02,
    tiktok: 0.015,
    youtube: 0.025,
    telegram: 0.01,
    spotify: 0.03
  };

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.countersAnimated) {
            this.countersAnimated = true;
            this.animateCounters();
          }
        });
      },
      { threshold: 0.3 }
    );

    const counterSection = document.getElementById('stats-section');
    if (counterSection) {
      this.observer.observe(counterSection);
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  trackByNetwork(index: number, network: SocialNetwork): string {
    return network.id;
  }

  private checkCounterVisibility(): void {
    if (this.countersAnimated) return;
    const counterSection = document.getElementById('stats-section');
    if (!counterSection) return;
    const rect = counterSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      this.countersAnimated = true;
      this.animateCounters();
    }
  }

  private animateCounters(): void {
    this.stats.forEach(stat => {
      const el = document.getElementById(`stat-${stat.label.replace(/\s+/g, '-').toLowerCase()}`);
      if (!el) return;
      const target = stat.value;
      const duration = 2000;
      const startTime = performance.now();

      const updateCounter = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = target * easeProgress;
        const formatted = target % 1 !== 0 ? current.toFixed(1) : Math.floor(current);
        el.textContent = `${formatted}${stat.suffix}`;
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          const final = target % 1 !== 0 ? target.toFixed(1) : target;
          el.textContent = `${final}${stat.suffix}`;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  }

  toggleFAQ(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }

  selectNetwork(network: SocialNetwork): void {
    this.selectedNetwork = network;
    this.calculateEstimate();
  }

  onFollowersChange(): void {
    this.calculateEstimate();
  }

  onDeliverySpeedChange(): void {
    this.calculateEstimate();
  }

  private calculateEstimate(): void {
    if (!this.selectedNetwork) return;

    const rate = this.pricingRates[this.selectedNetwork.id] || 0.02;
    const priceNum = this.followers * rate;
    this.estimatedPrice = priceNum.toFixed(2);

    if (this.deliverySpeed === 'instant') {
      this.estimatedTime = 'Inmediata';
      this.savings = (priceNum * 0.3).toFixed(2);
    } else if (this.deliverySpeed === 'fast') {
      this.estimatedTime = '30 min - 1 hora';
      this.savings = (priceNum * 0.1).toFixed(2);
    } else {
      this.estimatedTime = '2-4 horas';
      this.savings = '0.00';
    }
  }

  hasSavings(): boolean {
    return parseFloat(this.savings) > 0;
  }

  triggerConfetti(): void {
    this.confetti.celebrate(0.5, 0.5);
    setTimeout(() => this.confetti.smallCelebration(), 200);
    setTimeout(() => this.confetti.smallCelebration(), 400);
  }

  scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
