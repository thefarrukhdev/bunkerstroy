import { z } from 'zod';

export const EnergyRatingSchema = z.enum(['A++', 'A+', 'A', 'B', 'STANDARD']);
export type EnergyRating = z.infer<typeof EnergyRatingSchema>;

export const MeasurementUnitSchema = z.enum([
  'BAG_50KG',
  'TON',
  'PIECE',
  'SQ_METER',
  'CUBIC_METER',
  'ROLL',
  'METER',
  'LITER'
]);
export type MeasurementUnit = z.infer<typeof MeasurementUnitSchema>;

export const ItemTypeSchema = z.enum(['MATERIAL', 'LABOR', 'TOOL', 'RENTAL']);
export type ItemType = z.infer<typeof ItemTypeSchema>;

export const RepairTypeSchema = z.enum([
  'INTERNAL',
  'EXTERNAL',
  'WORKFORCE',
  'EQUIPMENT',
  'MACHINERY_RENTAL',
  'UNIVERSAL'
]);
export type RepairType = z.infer<typeof RepairTypeSchema>;

export const ProductVariantSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  sku: z.string(),
  color: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  weight: z.string().optional().nullable(),
  length: z.string().optional().nullable(),
  priceDelta: z.number().default(0),
  stock: z.number().int().nonnegative().default(0)
});
export type ProductVariant = z.infer<typeof ProductVariantSchema>;

export const ProductSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2),
  slug: z.string(),
  categoryId: z.string().uuid(),
  supplierId: z.string().uuid(),
  supplierName: z.string(),
  price: z.number().positive(),
  unit: MeasurementUnitSchema,
  stock: z.number().int().nonnegative(),
  minOrder: z.number().int().positive().default(1),
  energyEfficiencyRating: EnergyRatingSchema.default('STANDARD'),
  isEscoCertified: z.boolean().default(false),
  description: z.string(),
  itemType: ItemTypeSchema.default('MATERIAL'),
  repairType: RepairTypeSchema.default('UNIVERSAL'),
  region: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  images: z.array(z.string().url()).default([]),
  warranty: z.string().optional().nullable(),
  hasDelivery: z.boolean().default(true),
  hasBonus: z.boolean().default(false),
  bonusDescription: z.string().optional().nullable(),
  bonusThreshold: z.number().optional().nullable(),
  bonusAmount: z.number().optional().nullable(),
  variants: z.array(ProductVariantSchema).default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
export type Product = z.infer<typeof ProductSchema>;

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  slug: z.string(),
  parentId: z.string().uuid().optional().nullable(),
  icon: z.string().optional().nullable(),
  orderIndex: z.number().int().default(0)
});
export type Category = z.infer<typeof CategorySchema>;
