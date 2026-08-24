import { Component, OnInit, OnDestroy, inject, PLATFORM_ID, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AnimationService } from '../../shared/services/animation.service';
import { GsRevealDirective } from '../../shared/directives/gs-reveal.directive';

interface BrandPreview {
  name: string;
  model: string;
  accent: 'primary' | 'amber' | 'emerald';
  seer2: string;
  noiseDb: string;
  minTemp: string;
  warranty: string;
  smartScore?: string;
  isBestSeer?: boolean;
  isBestNoise?: boolean;
  isBestTemp?: boolean;
  isBestSmart?: boolean;
  color: string;
  borderColor: string;
}

interface Testimonial {
  name: string;
  location: string;
  service: string;
  serviceIcon: string;
  text: string;
  rating: number;
  date: string;
}

interface Stat {
  icon: string;
  value: number;
  suffix: string;
  label: string;
  current: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, GsRevealDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private animations = inject(AnimationService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  currentYear = new Date().getFullYear();

  satisfactionPercent = 0;
  estimatedArrival = 0;

  @ViewChild('heroBadge', { static: true }) heroBadge!: ElementRef;
  @ViewChild('heroTitle', { static: true }) heroTitle!: ElementRef;
  @ViewChild('heroDesc', { static: true }) heroDesc!: ElementRef;

  readonly heroWords = ['Climatización HVAC', 'Servicios Eléctricos', 'Mantenimiento Integral'];
  typedWord = '';
  private wordIndex = 0;
  private typeTimer: any = null;
  private deleting = false;

  readonly stats: Stat[] = [
    { icon: 'groups', value: 512, suffix: '+', label: 'Clientes atendidos', current: 0 },
    { icon: 'workspace_premium', value: 15, suffix: '', label: 'Años de experiencia', current: 0 },
    { icon: 'schedule', value: 28, suffix: ' min', label: 'Respuesta promedio', current: 0 },
    { icon: 'star', value: 49, suffix: '★', label: 'Calificación de usuarios', current: 0 }
  ];

  readonly brands: BrandPreview[] = [
    {
      name: 'Mirage', model: `Titan Inverter ${this.currentYear}`, accent: 'primary',
      seer2: '21.5', noiseDb: '19 dB', minTemp: '-15°C', warranty: '5 años',
      isBestNoise: true, isBestTemp: true,
      color: 'rgba(0,101,145,0.75)', borderColor: '#006591'
    },
    {
      name: 'Prime', model: `EliteStar Pro ${this.currentYear}`, accent: 'amber',
      seer2: '20.0', noiseDb: '22 dB', minTemp: '-10°C', smartScore: '92/100', warranty: '3 años',
      isBestSmart: true,
      color: 'rgba(254,166,25,0.75)', borderColor: '#fea619'
    },
    {
      name: 'Carrier', model: `Xpower Inverter ${this.currentYear}`, accent: 'emerald',
      seer2: '22.0', noiseDb: '21 dB', minTemp: '-15°C', warranty: '5 años',
      isBestSeer: true, isBestTemp: true,
      color: 'rgba(16,185,129,0.75)', borderColor: '#10b981'
    }
  ];

  readonly accentRing: Record<BrandPreview['accent'], string> = {
    primary: 'border-[#006591]/30 hover:shadow-[#006591]/25',
    amber: 'border-secondary-container/30 hover:shadow-secondary-container/25',
    emerald: 'border-emerald-500/30 hover:shadow-emerald-500/25'
  };

  readonly accentIconClass: Record<BrandPreview['accent'], string> = {
    primary: 'bg-[#006591]/20 border-[#006591]/40 text-[#5eb2d9]',
    amber: 'bg-secondary-container/20 border-secondary-container/40 text-secondary-container',
    emerald: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500'
  };

  readonly accentTextClass: Record<BrandPreview['accent'], string> = {
    primary: 'text-[#5eb2d9]',
    amber: 'text-secondary-container',
    emerald: 'text-emerald-500'
  };

  readonly testimonials: Testimonial[] = [
    {
      name: 'María Fernández', location: 'Col. Centro', service: 'Instalación Minisplit', serviceIcon: 'ac_unit',
      text: 'Instalaron mi minisplit en menos de 3 horas. Puntuales, limpios y me explicaron todo el funcionamiento. El ahorro en el recibo de luz se notó desde el primer mes.',
      rating: 5, date: 'Hace 2 semanas'
    },
    {
      name: 'Carlos Mendoza', location: 'Zona Norte', service: 'Falla eléctrica', serviceIcon: 'bolt',
      text: 'Se fue la luz en un cuarto de la casa a las 11 de la noche. Llegaron en 25 minutos y encontraron un corto escondido en la pared. Servicio impecable.',
      rating: 5, date: 'Hace 1 mes'
    },
    {
      name: 'Ana Lucía Rivera', location: 'Col. Jardines', service: 'Mantenimiento preventivo', serviceIcon: 'handyman',
      text: 'Llevo un año con el plan de mantenimiento y cero fallas. Te avisan antes de cada visita y dejan un reporte por WhatsApp. Muy profesionales.',
      rating: 5, date: 'Hace 3 semanas'
    },
    {
      name: 'Roberto Salinas', location: 'Plaza Comercial Arboledas', service: 'HVAC Comercial', serviceIcon: 'corporate_fare',
      text: 'Nos instalaron el sistema de climatización de toda la plaza. Cumplieron tiempos, presupuesto y normativa. Los recomiendo ampliamente para proyectos comerciales.',
      rating: 5, date: 'Hace 2 meses'
    },
    {
      name: 'Patricia Gómez', location: 'Col. Residencial Sur', service: 'Reparación de emergencia', serviceIcon: 'emergency',
      text: 'Mi aire descompuesto en plena ola de calor y con un bebé en casa. A las 2 horas ya estaba funcionando. Gracias de verdad al equipo de emergencias.',
      rating: 5, date: 'Hace 1 semana'
    },
    {
      name: 'Jorge Villaseñor', location: 'Col. Industrial', service: 'Cableado estructurado', serviceIcon: 'electrical_services',
      text: 'Renovaron todo el cableado de mi taller quedando a norma y con certificado. Precio justo y excelente comunicación durante todo el proyecto.',
      rating: 5, date: 'Hace 3 meses'
    }
  ];

  get ratingValue(): string {
    return (this.stats[3].current / 10).toFixed(1);
  }

  private statsAnimated = false;

  ngOnInit(): void {
    this.startCounters();
    this.startTypewriter();
  }

  ngAfterViewInit(): void {
    this.animateHeroWords();
    this.animateBrandCards();
  }

  ngOnDestroy(): void {
    if (this.typeTimer) clearTimeout(this.typeTimer);
  }

  onMouseMove(e: MouseEvent, card: any): void {
    const target = (card && card.getBoundingClientRect ? card : (e.target as HTMLElement));
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }

  private startCounters(): void {
    if (!this.isBrowser) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.statsAnimated) {
          this.statsAnimated = true;
          this.animations.countUp(0, 98, 1.6, (v) => (this.satisfactionPercent = Math.round(v)));
          this.animations.countUp(0, 45, 1.6, (v) => (this.estimatedArrival = Math.round(v)));
          this.stats.forEach((stat, i) => {
            this.animations.countUp(0, stat.value, 1.8 + i * 0.15, (v) => (stat.current = Math.round(v)));
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.5 });

    const countersSection = document.querySelector('.franja-confianza-counters');
    if (countersSection) obs.observe(countersSection);
    else {
      this.statsAnimated = true;
      this.animations.countUp(0, 98, 1.6, (v) => (this.satisfactionPercent = Math.round(v)));
      this.animations.countUp(0, 45, 1.6, (v) => (this.estimatedArrival = Math.round(v)));
      this.stats.forEach((stat, i) => {
        this.animations.countUp(0, stat.value, 1.8 + i * 0.15, (v) => (stat.current = Math.round(v)));
      });
    }
  }

  private startTypewriter(): void {
    if (!this.isBrowser || this.animations.reducedMotion) {
      this.typedWord = this.heroWords[0];
      return;
    }
    const tick = () => {
      const word = this.heroWords[this.wordIndex];
      if (!this.deleting) {
        this.typedWord = word.slice(0, this.typedWord.length + 1);
        if (this.typedWord === word) {
          this.deleting = true;
          this.typeTimer = setTimeout(tick, 2200);
          return;
        }
        this.typeTimer = setTimeout(tick, 65);
      } else {
        this.typedWord = word.slice(0, this.typedWord.length - 1);
        if (this.typedWord === '') {
          this.deleting = false;
          this.wordIndex = (this.wordIndex + 1) % this.heroWords.length;
          this.typeTimer = setTimeout(tick, 350);
          return;
        }
        this.typeTimer = setTimeout(tick, 32);
      }
    };
    this.typeTimer = setTimeout(tick, 600);
  }

  private animateHeroWords(): void {
    if (!this.isBrowser || this.animations.reducedMotion) {
      this.heroBadge.nativeElement.style.opacity = '1';
      this.heroTitle.nativeElement.style.opacity = '1';
      this.heroDesc.nativeElement.style.opacity = '1';
      return;
    }
    this.animations.zoneRunOutside(() => {
      gsap.to(this.heroBadge.nativeElement, {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 0.9, ease: 'power3.out'
      });
      gsap.to(this.heroTitle.nativeElement, {
        opacity: 1, y: 0,
        duration: 0.9, ease: 'power3.out'
      });
      const words = this.heroTitle.nativeElement.querySelectorAll('.word-stagger');
      if (words.length) {
        gsap.from(words, {
          opacity: 0, y: 40, filter: 'blur(8px)',
          duration: 0.8, ease: 'power3.out',
          stagger: 0.08,
          delay: 0.2
        });
      }
      gsap.to(this.heroDesc.nativeElement, {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 0.9, ease: 'power3.out',
        delay: 0.6
      });
    });
  }

  private animateBrandCards(): void {
    if (!this.isBrowser || this.animations.reducedMotion) return;
    this.animations.zoneRunOutside(() => {
      const cards = document.querySelectorAll('.brand-card');
      if (!cards.length) return;
      gsap.from(cards, {
        opacity: 0,
        y: 32,
        scale: 0.95,
        filter: 'blur(6px)',
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.8
      });
    });
  }
}
