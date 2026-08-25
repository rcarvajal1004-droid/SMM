import { Injectable } from '@angular/core';

export type SunExposure = 'low' | 'normal' | 'high';

export interface BtuCalculationInput {
  area: number;
  people: number;
  sunExposure: SunExposure;
}

export interface BtuCalculation {
  btu: number;
  tons: string;
}

export interface BtuCalculationStrategy {
  calculate(input: BtuCalculationInput): BtuCalculation;
}

export class StandardBtuCalculationStrategy implements BtuCalculationStrategy {
  calculate(input: BtuCalculationInput): BtuCalculation {
    if (input.area <= 0) return { btu: 0, tons: '0' };

    let btu = input.area * 600;
    if (input.people > 2) btu += (input.people - 2) * 500;
    if (input.sunExposure === 'high') btu *= 1.15;
    if (input.sunExposure === 'low') btu *= 0.9;

    const roundedBtu = Math.ceil(btu / 500) * 500;
    return { btu: roundedBtu, tons: (roundedBtu / 12000).toFixed(1) };
  }
}

@Injectable({ providedIn: 'root' })
export class BtuCalculatorService {
  private readonly strategy: BtuCalculationStrategy = new StandardBtuCalculationStrategy();

  calculate(input: BtuCalculationInput): BtuCalculation {
    return this.strategy.calculate(input);
  }
}
