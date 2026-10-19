import { z } from 'zod';

export const LogLevelSchema = z.enum(['INFO', 'WARNING', 'ERROR', 'SUCCESS']);
export type LogLevel = z.infer<typeof LogLevelSchema>;

export const LogCategorySchema = z.enum([
  'AUTH',
  'CABINET',
  'PRODUCT',
  'ORDER',
  'PAYMENT',
  'LOGISTICS',
  'ESCO',
  'SYSTEM_SECURITY'
]);
export type LogCategory = z.infer<typeof LogCategorySchema>;

export const SystemLogSchema = z.object({
  id: z.string().uuid(),
  action: z.string(),
  actor: z.string(),
  category: LogCategorySchema,
  details: z.string(),
  ipAddress: z.string().optional().nullable(),
  level: LogLevelSchema.default('INFO'),
  timestamp: z.string().datetime()
});
export type SystemLog = z.infer<typeof SystemLogSchema>;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
