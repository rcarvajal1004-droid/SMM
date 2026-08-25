import { Injectable } from '@angular/core';
import { Equipment, EquipmentBrand, EquipmentCategory } from '../models/equipment.model';

@Injectable({ providedIn: 'root' })
export class EquipmentCatalogService {
  readonly equipment: readonly Equipment[] = [
    { id: 'mirage-x5', brand: 'Mirage', model: 'X5 Inverter', category: 'residencial', btu: 12000, seer2: 20.5, noiseDb: 20, minTempC: -10, coolingSpeedScore: 84, smartScore: 78, warrantyYears: 5, costBenefitScore: 91, color: 'rgba(0,101,145,0.75)', borderColor: '#006591', dataSource: 'demostrativo' },
    { id: 'mirage-magnum-18', brand: 'Mirage', model: 'Magnum 18', category: 'residencial', btu: 18000, seer2: 21.5, noiseDb: 19, minTempC: -15, coolingSpeedScore: 88, smartScore: 80, warrantyYears: 5, costBenefitScore: 85, color: 'rgba(0,101,145,0.75)', borderColor: '#006591', dataSource: 'demostrativo' },
    { id: 'mirage-xmi-split-2', brand: 'Mirage', model: 'XMI Split II', category: 'comercial', btu: 24000, seer2: 20.8, noiseDb: 23, minTempC: -10, coolingSpeedScore: 90, smartScore: 82, warrantyYears: 5, costBenefitScore: 87, color: 'rgba(0,101,145,0.75)', borderColor: '#006591', dataSource: 'demostrativo' },
    { id: 'prime-inverter-r410a', brand: 'Prime', model: 'Inverter R410A', category: 'residencial', btu: 12000, seer2: 20.0, noiseDb: 22, minTempC: -10, coolingSpeedScore: 82, smartScore: 92, warrantyYears: 3, costBenefitScore: 90, color: 'rgba(254,166,25,0.75)', borderColor: '#fea619', dataSource: 'demostrativo' },
    { id: 'prime-inverter-r32-seer-20', brand: 'Prime', model: 'Inverter R32 SEER 20', category: 'residencial', btu: 18000, seer2: 20.4, noiseDb: 21, minTempC: -10, coolingSpeedScore: 85, smartScore: 95, warrantyYears: 3, costBenefitScore: 92, color: 'rgba(254,166,25,0.75)', borderColor: '#fea619', dataSource: 'demostrativo' },
    { id: 'prime-piso-techo-inverter', brand: 'Prime', model: 'Piso/Techo Inverter', category: 'comercial', btu: 24000, seer2: 19.8, noiseDb: 25, minTempC: -8, coolingSpeedScore: 86, smartScore: 89, warrantyYears: 3, costBenefitScore: 94, color: 'rgba(254,166,25,0.75)', borderColor: '#fea619', dataSource: 'demostrativo' },
    { id: 'carrier-infinity-21', brand: 'Carrier', model: 'Infinity 21 (26VNA1)', category: 'residencial', btu: 12000, seer2: 21.0, noiseDb: 20, minTempC: -15, coolingSpeedScore: 91, smartScore: 86, warrantyYears: 5, costBenefitScore: 80, color: 'rgba(16,185,129,0.75)', borderColor: '#10b981', dataSource: 'demostrativo' },
    { id: 'carrier-performance-18', brand: 'Carrier', model: 'Performance 18 (26TPA8)', category: 'residencial', btu: 18000, seer2: 21.7, noiseDb: 20, minTempC: -15, coolingSpeedScore: 93, smartScore: 87, warrantyYears: 5, costBenefitScore: 79, color: 'rgba(16,185,129,0.75)', borderColor: '#10b981', dataSource: 'demostrativo' },
    { id: 'carrier-comfort-16', brand: 'Carrier', model: 'Comfort 16 (26SCA5)', category: 'comercial', btu: 24000, seer2: 22.0, noiseDb: 21, minTempC: -15, coolingSpeedScore: 94, smartScore: 87, warrantyYears: 5, costBenefitScore: 78, color: 'rgba(16,185,129,0.75)', borderColor: '#10b981', dataSource: 'demostrativo' }
  ];

  byCategory(category: EquipmentCategory | 'todos'): Equipment[] {
    return this.equipment.filter(item => category === 'todos' || item.category === category);
  }

  byBrands(brands: readonly EquipmentBrand[]): Equipment[] {
    return this.equipment.filter(item => brands.includes(item.brand));
  }
}
