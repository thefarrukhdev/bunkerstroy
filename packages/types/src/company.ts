import { z } from 'zod';

export const CompanyStatusSchema = z.enum(['ACTIVE', 'LIQUIDATED', 'SUSPENDED']);
export type CompanyStatus = z.infer<typeof CompanyStatusSchema>;

export const StirRegex = /^\d{9}$/;

export const CompanyInfoSchema = z.object({
  inn: z.string().regex(StirRegex, "STIR aynan 9 ta raqamdan iborat bo'lishi shart"),
  companyName: z.string().min(2),
  shortName: z.string().optional().nullable(),
  status: CompanyStatusSchema,
  statusDescription: z.string(),
  director: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  registrationDate: z.string().optional().nullable(),
  activityType: z.string().optional().nullable(),
  vatPayer: z.boolean().default(false)
});
export type CompanyInfo = z.infer<typeof CompanyInfoSchema>;

export const EImzoChallengeSchema = z.object({
  challengeId: z.string().uuid(),
  challengeText: z.string(),
  inn: z.string().optional().nullable(),
  createdAt: z.number(),
  expiresAt: z.number(),
  isConsumed: z.boolean().default(false)
});
export type EImzoChallenge = z.infer<typeof EImzoChallengeSchema>;

export const EImzoVerifyRequestSchema = z.object({
  challengeId: z.string().uuid(),
  pkcs7B64: z.string().min(20, "PKCS#7 imzo ma'lumoti kiritilishi shart"),
  inn: z.string().regex(StirRegex).optional().nullable()
});
export type EImzoVerifyRequest = z.infer<typeof EImzoVerifyRequestSchema>;
