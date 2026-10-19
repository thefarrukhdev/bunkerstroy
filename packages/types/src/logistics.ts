import { z } from 'zod';

export const VehicleTypeSchema = z.enum([
  'DUMP_TRUCK_SAMOSVAL',
  'CONCRETE_MIXER',
  'CRANE_MANIPULATOR',
  'GAZEL_LIGHT_TRUCK',
  'SEMI_TRAILER_FURA'
]);
export type VehicleType = z.infer<typeof VehicleTypeSchema>;

export const LogisticsVehicleSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: VehicleTypeSchema,
  plateNumber: z.string().optional().nullable(),
  capacityTons: z.number().positive(),
  basePrice: z.number().nonnegative(),
  pricePerKm: z.number().positive(),
  isAvailable: z.boolean().default(true),
  driverName: z.string(),
  driverPhone: z.string(),
  currentLocationName: z.string(),
  currentLat: z.number().optional().nullable(),
  currentLng: z.number().optional().nullable(),
  imageUrl: z.string().url()
});
export type LogisticsVehicle = z.infer<typeof LogisticsVehicleSchema>;

export const RouteQuoteRequestSchema = z.object({
  vehicleId: z.string().uuid().optional(),
  vehicleType: VehicleTypeSchema.optional(),
  distanceKm: z.number().positive(),
  cargoWeightTons: z.number().positive(),
  originAddress: z.string(),
  destinationAddress: z.string(),
  originCoords: z.object({ lat: number(), lng: number() }).optional(),
  destinationCoords: z.object({ lat: number(), lng: number() }).optional()
});
export type RouteQuoteRequest = z.infer<typeof RouteQuoteRequestSchema>;

function number() {
  return z.number();
}

export const RouteQuoteResponseSchema = z.object({
  distanceKm: z.number(),
  estimatedHours: z.number(),
  baseCost: z.number(),
  distanceCost: z.number(),
  totalCost: z.number(),
  currency: z.literal("so'm"),
  recommendedVehicleType: VehicleTypeSchema
});
export type RouteQuoteResponse = z.infer<typeof RouteQuoteResponseSchema>;
