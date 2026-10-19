import { z } from 'zod';

export const OrderStatusSchema = z.enum([
  'PENDING',
  'CONFIRMED',
  'ASSIGNED_TO_FLEET',
  'IN_TRANSIT',
  'DELIVERED',
  'CANCELLED'
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
  productId: z.string().uuid(),
  productTitle: z.string(),
  supplierId: z.string().uuid(),
  quantity: z.number().positive(),
  unit: z.string(),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive()
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

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
  totalAmount: z.number().positive(),
  deliveryFee: z.number().nonnegative().default(0),
  discountAmount: z.number().nonnegative().default(0),
  finalAmount: z.number().positive(),
  status: OrderStatusSchema.default('PENDING'),
  paymentMethod: PaymentMethodSchema,
  paymentStatus: PaymentStatusSchema.default('PENDING'),
  deliveryAddress: DeliveryAddressSchema,
  vehicleType: z.string().optional().nullable(),
  assignedDriverId: z.string().uuid().optional().nullable(),
  trackingCode: z.string().optional().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
export type Order = z.infer<typeof OrderSchema>;
