import { signal, computed } from '@angular/core';
import { SmmService } from '../../smm/models/smm.model';

export const selectedService = signal<SmmService | null>(null);
export const quantity = signal<number>(0);
export const userBalance = signal<number>(0);

export const totalCost = computed(() => {
  const service = selectedService();
  const qty = quantity();
  if (!service || qty <= 0) return 0;
  return (service.ratePer1000 / 1000) * qty;
});

export const hasEnoughBalance = computed(() => {
  return userBalance() >= totalCost();
});

export const quantityIsValid = computed(() => {
  const service = selectedService();
  const qty = quantity();
  if (!service || qty <= 0) return false;
  return qty >= service.min && qty <= service.max;
});
