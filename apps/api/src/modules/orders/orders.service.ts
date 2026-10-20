import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import crypto from 'crypto';
import { Order, OrderItem } from '@bunkerstroy/types';
import { PrismaService } from '../../prisma/prisma.service';
import { CatalogService } from '../catalog/catalog.service';

@Injectable()
export class OrdersService {
  private fallbackOrders: Order[] = [];

  constructor(
    private readonly prisma: PrismaService,
    private readonly catalogService: CatalogService
  ) {}

  async createOrder(payload: any): Promise<Order> {
    const { buyerName, buyerPhone, items, deliveryAddress, paymentMethod, vehicleType } = payload;
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('Savatda mahsulotlar mavjud emas');
    }
    if (!buyerPhone) {
      throw new BadRequestException('Telefon raqam kiritilishi shart');
    }

    const orderId = crypto.randomUUID();
    const orderNumber = `BS-${Date.now().toString().slice(-6)}`;
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const productId = item.productId;
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);

      if (!productId) {
        throw new BadRequestException('Mahsulot identifikatori kiritilmagan');
      }

      // Security (CWE-472 Price Tampering Fix):
      // ALWAYS look up the official price server-side from Catalog / DB! Never trust client price.
      const product = await this.catalogService.findById(productId);
      if (!product) {
        throw new NotFoundException(`Mahsulot topilmadi: ${productId}`);
      }

      const unitPrice = Number(product.price);
      const lineTotal = unitPrice * quantity;
      totalAmount += lineTotal;

      orderItems.push({
        id: crypto.randomUUID(),
        orderId,
        productId: product.id,
        productTitle: product.title,
        supplierId: product.supplierId,
        quantity,
        unit: product.unit,
        unitPrice,
        totalPrice: lineTotal
      });
    }

    const deliveryFee = 150000;
    const finalAmount = totalAmount + deliveryFee;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      buyerId: 'client-guest',
      buyerName: buyerName || 'Hurmatli Buyurtmachi',
      buyerPhone,
      items: orderItems,
      totalAmount,
      deliveryFee,
      discountAmount: 0,
      finalAmount,
      status: 'CONFIRMED',
      paymentMethod: paymentMethod || 'CASH_ON_DELIVERY',
      paymentStatus: 'PENDING',
      deliveryAddress: {
        region: deliveryAddress?.region || 'Toshkent shahri',
        district: deliveryAddress?.district || 'Chilonzor tumani',
        street: deliveryAddress?.street || 'Markaz'
      },
      vehicleType: vehicleType || 'Samosval (HOWO)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Attempt persistent save to PostgreSQL / Prisma
    try {
      let user = await this.prisma.user.findFirst({
        where: { phone: buyerPhone }
      });
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            phone: buyerPhone,
            displayName: buyerName || 'Hurmatli Buyurtmachi',
            passwordHash: '$2b$10$temporaryGuestOrderPasswordHashBunker2026',
            role: 'CLIENT'
          }
        });
      }

      newOrder.buyerId = user.id;

      await this.prisma.order.create({
        data: {
          id: orderId,
          orderNumber,
          buyerId: user.id,
          totalAmount: totalAmount,
          deliveryFee: deliveryFee,
          discountAmount: 0,
          finalAmount: finalAmount,
          status: 'CONFIRMED',
          deliveryRegion: newOrder.deliveryAddress.region,
          deliveryDistrict: newOrder.deliveryAddress.district,
          deliveryStreet: newOrder.deliveryAddress.street,
          vehicleType: newOrder.vehicleType
        }
      });
    } catch (err) {
      console.warn('Prisma createOrder fallback to memory store (DB connecting or error):', err);
    }

    this.fallbackOrders.unshift(newOrder);
    return newOrder;
  }

  async findAll(): Promise<Order[]> {
    try {
      const dbOrders = await this.prisma.order.findMany({
        include: {
          buyer: true,
          items: {
            include: { product: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      if (dbOrders && dbOrders.length > 0) {
        return dbOrders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          buyerId: o.buyerId,
          buyerName: o.buyer?.displayName || 'Hurmatli Buyurtmachi',
          buyerPhone: o.buyer?.phone || '',
          items: o.items.map((it) => ({
            id: it.id,
            orderId: o.id,
            productId: it.productId,
            productTitle: it.product?.title || 'Qurilish materiali',
            supplierId: it.product?.supplierId || 'sup-1',
            quantity: it.quantity,
            unit: it.unit as any,
            unitPrice: Number(it.unitPrice),
            totalPrice: Number(it.totalPrice)
          })),
          totalAmount: Number(o.totalAmount),
          deliveryFee: Number(o.deliveryFee),
          discountAmount: Number(o.discountAmount),
          finalAmount: Number(o.finalAmount),
          status: o.status as any,
          paymentMethod: 'CASH_ON_DELIVERY',
          paymentStatus: 'PENDING',
          deliveryAddress: {
            region: o.deliveryRegion,
            district: o.deliveryDistrict,
            street: o.deliveryStreet || ''
          },
          vehicleType: o.vehicleType || 'Samosval (HOWO)',
          createdAt: o.createdAt.toISOString(),
          updatedAt: o.updatedAt.toISOString()
        }));
      }
    } catch (err) {
      console.warn('Prisma OrdersService findAll fallback due to DB error/connecting:', err);
    }

    return this.fallbackOrders;
  }
}
