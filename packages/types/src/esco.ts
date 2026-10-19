import { z } from 'zod';

export const BuildingTypeSchema = z.enum([
  'RESIDENTIAL_MULTI_STOREY',
  'PRIVATE_HOUSE_COTTAGE',
  'COMMERCIAL_OFFICE',
  'INDUSTRIAL_WAREHOUSE',
  'PUBLIC_SCHOOL_HOSPITAL'
]);
export type BuildingType = z.infer<typeof BuildingTypeSchema>;

export const EscoAuditInputSchema = z.object({
  buildingType: BuildingTypeSchema,
  areaM2: z.number().positive(),
  currentEnergyUsageKwh: z.number().positive(),
  wallMaterial: z.string().default("Pishiq g'isht"),
  windowType: z.string().default('Oddiy ikki kamerali plastik'),
  currentHeatingType: z.string().default('Gaz qozoni'),
  region: z.string().default('Toshkent')
});
export type EscoAuditInput = z.infer<typeof EscoAuditInputSchema>;

export const EscoCalculationResultSchema = z.object({
  energySavingsPercent: z.number(),
  paybackYears: z.number(),
  annualSavingsSum: z.number(),
  co2ReductionTons: z.number(),
  recommendedMaterials: z.array(z.string()),
  insulationAdvice: z.string(),
  auditScore: z.string().default('B+')
});
export type EscoCalculationResult = z.infer<typeof EscoCalculationResultSchema>;
