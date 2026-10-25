import { z } from 'zod';

export const UserRoleSchema = z.enum([
  'ADMIN',
  'SUPPLIER',
  'CONTRACTOR',
  'LOGISTICS_DRIVER',
  'ESCO_AUDITOR',
  'CLIENT'
]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const SupplierTypeSchema = z.enum(['LOCAL', 'GLOBAL']);
export type SupplierType = z.infer<typeof SupplierTypeSchema>;

export const UserTypeSchema = z.enum(['INDIVIDUAL', 'LEGAL_ENTITY']);
export type UserType = z.infer<typeof UserTypeSchema>;

export const VerificationStatusSchema = z.enum(['PENDING', 'VERIFIED', 'REJECTED']);
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;

export const UserStatusSchema = z.enum(['ACTIVE', 'BLOCKED', 'SUSPENDED']);
export type UserStatus = z.infer<typeof UserStatusSchema>;

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  phone: z.string().min(9),
  email: z.string().email().optional().nullable(),
  displayName: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  role: UserRoleSchema,
  userType: UserTypeSchema.default('INDIVIDUAL'),
  supplierType: SupplierTypeSchema.default('LOCAL'),
  isAllowedSplitPayment: z.boolean().default(false),
  rating: z.number().default(5.0),
  isBlocked: z.boolean().default(false),
  status: UserStatusSchema.default('ACTIVE'),
  verificationStatus: VerificationStatusSchema.default('PENDING'),
  inn: z.string().length(9).optional().nullable(),
  companyName: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  mahalla: z.string().optional().nullable(),
  eimzoSerialNumber: z.string().optional().nullable(),
  eimzoVerifiedAt: z.string().datetime().optional().nullable(),
  contractNumber: z.string().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
export type UserProfile = z.infer<typeof UserProfileSchema>;
