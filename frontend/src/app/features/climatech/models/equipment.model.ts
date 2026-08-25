export type EquipmentBrand = 'Mirage' | 'Prime' | 'Carrier';
export type EquipmentCategory = 'residencial' | 'comercial';

export interface Equipment {
  id: string;
  brand: EquipmentBrand;
  model: string;
  category: EquipmentCategory;
  btu: number;
  seer2: number;
  noiseDb: number;
  minTempC: number;
  coolingSpeedScore: number;
  smartScore: number;
  warrantyYears: number;
  costBenefitScore: number;
  color: string;
  borderColor: string;
  dataSource: 'demostrativo';
}
