import { z } from 'zod';

export const PartnerStatusCodeSchema = z.enum(['OPERATIONAL', 'DEGRADED', 'DOWN']);
export type PartnerStatusCode = z.infer<typeof PartnerStatusCodeSchema>;

export const PartnerIntegrationSchema = z.object({
  id: z.string().uuid(),
  code: z.string(), // PAYME, CLICK, ESCROW_BANK, E_IMZO, ESKIZ_SMS, GPS_TRACKER
  name: z.string(),
  provider: z.string(),
  status: PartnerStatusCodeSchema.default('OPERATIONAL'),
  contractEnd: z.string().datetime().optional().nullable(),
  lastSyncAt: z.string().datetime(),
  errorCount: z.number().int().nonnegative().default(0),
  details: z.record(z.any()).optional().nullable(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});
export type PartnerIntegration = z.infer<typeof PartnerIntegrationSchema>;
