import { z } from 'zod';

export const OrderStatusSchema = z.enum([
  'DRAFT',
  'PENDING_PAYMENT',
  'PAID',
  'ACCEPTED',
  'PACKING',
  'ASSIGNED',
  'IN_TRANSIT',
  'ARRIVED',
  'FULLY_PAID',
  'RECEIVED',
  'COMPLETED',
  'CANCELLED',
  'DISPUTE',
  'RETURN_REQUESTED',
  'RETURNED',
  // Legacy mappings for backwards compatibility
  'PENDING',
  'CONFIRMED',
  'ASSIGNED_TO_FLEET',
  'DELIVERED'
]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const PaymentMethodSchema = z.enum([
  'PAYME',
  'CLICK',
  'UZUM',
  'BANK_TRANSFER',
  'CASH_ON_DELIVERY'
]);
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const PaymentModeSchema = z.enum(['FULL_100', 'SPLIT_50_50']);
export type PaymentMode = z.infer<typeof PaymentModeSchema>;

export const PaymentStatusSchema = z.enum([
  'PENDING',
  'PREAUTHORIZED',
  'PAID',
  'FAILED',
  'REFUNDED'
]);
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

export const OrderItemSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  subOrderId: z.string().uuid().optional().nullable(),
  productId: z.string().uuid(),
  productTitle: z.string(),
  supplierId: z.string().uuid().optional().nullable(),
  quantity: z.number().positive(),
  unit: z.string(),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive()
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

export const SubOrderSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  supplierId: z.string().uuid(),
  supplierName: z.string().optional().nullable(),
  status: OrderStatusSchema.default('PENDING_PAYMENT'),
  subTotal: z.number().positive(),
  deliveryFee: z.number().nonnegative().default(0),
  acceptanceCode: z.string().optional().nullable(),
  arrivedAt: z.string().datetime().optional().nullable(),
  completedAt: z.string().datetime().optional().nullable(),
  driverId: z.string().uuid().optional().nullable(),
  driverName: z.string().optional().nullable(),
  driverPhone: z.string().optional().nullable(),
  items: z.array(OrderItemSchema).optional().default([]),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});
export type SubOrder = z.infer<typeof SubOrderSchema>;

export const DisputeSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  openedById: z.string().uuid(),
  openedByName: z.string().optional().nullable(),
  reason: z.string(),
  evidenceUrls: z.array(z.string()).default([]),
  status: z.enum(['OPEN', 'RESOLVED_REFUND', 'REJECTED']).default('OPEN'),
  resolutionNote: z.string().optional().nullable(),
  refundAmount: z.number().optional().nullable(),
  resolvedAt: z.string().datetime().optional().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
export type Dispute = z.infer<typeof DisputeSchema>;

export const DeliveryAddressSchema = z.object({
  region: z.string(),
  district: z.string(),
  street: z.string().optional().nullable(),
  landmark: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable()
});
export type DeliveryAddress = z.infer<typeof DeliveryAddressSchema>;

export const OrderSchema = z.object({
  id: z.string().uuid(),
  orderNumber: z.string(),
  buyerId: z.string().uuid(),
  buyerName: z.string(),
  buyerPhone: z.string(),
  items: z.array(OrderItemSchema),
  subOrders: z.array(SubOrderSchema).optional().default([]),
  totalAmount: z.number().positive(),
  deliveryFee: z.number().nonnegative().default(0),
  discountAmount: z.number().nonnegative().default(0),
  finalAmount: z.number().positive(),
  status: OrderStatusSchema.default('PENDING_PAYMENT'),
  paymentMode: PaymentModeSchema.default('FULL_100'),
  firstPaymentAmount: z.number().optional().nullable(),
  secondPaymentAmount: z.number().optional().nullable(),
  isFirstPaid: z.boolean().default(false),
  isSecondPaid: z.boolean().default(false),
  acceptanceCode: z.string().optional().nullable(),
  isAcceptanceCodeRevealed: z.boolean().default(false),
  arrivedAt: z.string().datetime().optional().nullable(),
  waitingDeadline: z.string().datetime().optional().nullable(),
  paymentMethod: PaymentMethodSchema,
  paymentStatus: PaymentStatusSchema.default('PENDING'),
  deliveryAddress: DeliveryAddressSchema,
  vehicleType: z.string().optional().nullable(),
  assignedDriverId: z.string().uuid().optional().nullable(),
  trackingCode: z.string().optional().nullable(),
  paymentTransactionId: z.string().optional().nullable(),
  disputes: z.array(DisputeSchema).optional().default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
export type Order = z.infer<typeof OrderSchema>;
