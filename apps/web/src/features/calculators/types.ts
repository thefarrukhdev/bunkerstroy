export type CalculatorTab = 'concrete' | 'brick' | 'rebar' | 'esco';

export type ConcreteGrade = 'M150' | 'M200' | 'M250' | 'M300' | 'M350';

export interface ConcreteResult {
  volume: number;
  totalCementKg: number;
  cementBags50kg: number;
  cementTons: number;
  sandTons: number;
  gravelTons: number;
  waterLiters: number;
  estimatedCost: number;
}

export type BrickMaterialType = 'brick_standard' | 'gasblock_200' | 'gasblock_300';
export type WallThicknessType = 'half' | 'single' | 'one_and_half';

export interface BrickResult {
  netArea: number;
  unitCount: number;
  unitLabel: string;
  reserveCount: number;
  mortarM3: number;
  estimatedCost: number;
}

export interface RebarResult {
  massPerMeter: number;
  totalWeightKg: number;
  totalWeightTons: number;
  standardBars117m: number;
  estimatedCost: number;
}

export interface EscoResult {
  savingsPercent: number;
  annualSavingsUzs: number;
  co2Tons: number;
  basaltVolumeM3: number;
  investmentCost: number;
  paybackYears: number;
}
