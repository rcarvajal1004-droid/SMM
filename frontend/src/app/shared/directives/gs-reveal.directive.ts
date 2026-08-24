import {
  Directive, ElementRef, Input, OnInit, OnDestroy,
  PLATFORM_ID, inject, AfterViewInit
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

/**
 * Directiva de scroll-reveal premium.
 * Uso: <section gsReveal> o <section gsReveal="0.2"> para delay en segundos.
 * Asegura estado inicial invisible y entra con fade-up + ligero scale cuando se hace visible.
 * Si el usuario prefiere reducir el movimiento, no hace nada.
 */
@Directive({
  selector: '[gsReveal]',
  standalone: true
})
export class GsRevealDirective implements AfterViewInit, OnDestroy {
  @Input('gsReveal') delay: number | string = 0;
  @Input() gsRevealStagger = 0.12; // esperado: elementos hijos con clase .reveal-item

  private el = inject(ElementRef<HTMLElement>);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      this.el.nativeElement.style.opacity = '1';
      return;
    }

    const native = this.el.nativeElement;
    const items = native.querySelectorAll('.reveal-item');
    const targets = items.length > 0 ? Array.from(items) : [native];

    gsap.set(targets, { opacity: 0, y: 32, filter: 'blur(8px)' });

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        gsap.to(targets, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          delay: typeof this.delay === 'string' ? parseFloat(this.delay) || 0 : this.delay,
          stagger: items.length > 0 ? this.gsRevealStagger : 0,
          ease: 'power3.out',
          clearProps: 'transform,filter'
        });

        this.observer?.unobserve(native);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    this.observer.observe(native);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }
}
