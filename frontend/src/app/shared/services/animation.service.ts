import { Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/**
 * Servicio central de animaciones premium:
 * - Inicializa Lenis (smooth scroll) integrado con GSAP ScrollTrigger
 * - Expone utilidades para contadores animados y tipografías
 * - Respeta prefers-reduced-motion
 */
@Injectable({ providedIn: 'root' })
export class AnimationService {
  private zone = inject(NgZone);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private lenis: Lenis | null = null;
  private readonly lenisTicker = (time: number) => this.lenis?.raf(time * 1000);
  private initialized = false;

  get reducedMotion(): boolean {
    return this.isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /** Ejecuta una función fuera de la zona de Angular (para animaciones sin triggers de cambio). */
  zoneRunOutside(fn: () => void): void {
    this.zone.runOutsideAngular(fn);
  }

  /** Inicializa GSAP + Lenis + ScrollTrigger. Llamar una sola vez desde el root. */
  init(): void {
    if (!this.isBrowser || this.reducedMotion || this.initialized) return;

    this.zone.runOutsideAngular(() => {
      this.initialized = true;
      gsap.registerPlugin(ScrollTrigger);

      this.lenis = new Lenis({
        lerp: 0.11,
        smoothWheel: true,
        wheelMultiplier: 1
      });

      // Sincroniza Lenis con el ticker de GSAP
      gsap.ticker.add(this.lenisTicker);
      gsap.ticker.lagSmoothing(0);

      this.lenis.on('scroll', ScrollTrigger.update);
    });
  }

  /** Anima un número de `from` a `to` llamando onUpdate en cada frame. */
  countUp(from: number, to: number, duration: number, onUpdate: (v: number) => void): void {
    if (!this.isBrowser || this.reducedMotion) {
      onUpdate(to);
      return;
    }
    this.zone.runOutsideAngular(() => {
      const obj = { value: from };
      gsap.to(obj, {
        value: to,
        duration,
        ease: 'power2.out',
        onUpdate: () => this.zone.run(() => onUpdate(obj.value))
      });
    });
  }

  /** Escritura tipo máquina de escribir sobre un texto fijo. */
  typewriter(text: string, speedMs: number, onChar: (partial: string) => void, onDone?: () => void): void {
    if (!this.isBrowser || this.reducedMotion) {
      onChar(text);
      onDone?.();
      return;
    }
    this.zone.runOutsideAngular(() => {
      let i = 0;
      const tick = () => {
        i++;
        this.zone.run(() => onChar(text.slice(0, i)));
        if (i < text.length) setTimeout(tick, speedMs);
        else this.zone.run(() => onDone?.());
      };
      setTimeout(tick, 400);
    });
  }

  ngOnDestroy(): void {
    gsap.ticker.remove(this.lenisTicker);
    this.lenis?.destroy();
    this.lenis = null;
    this.initialized = false;
  }
}
