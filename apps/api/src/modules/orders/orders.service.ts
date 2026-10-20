import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import crypto from 'crypto';
import { Role, OrderStatus, UserType } from '@bunkerstroy/db';
import { Order, OrderItem } from '@bunkerstroy/types';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly prisma: PrismaService) {}

  private mapPrismaOrder(o: any): Order {
    return {
      id: o.id,
      orderNumber: o.orderNumber,
      buyerId: o.buyerId,
      buyerName: o.buyer?.displayName || 'Hurmatli Buyurtmachi',
      buyerPhone: o.buyer?.phone || '',
      items: Array.isArray(o.items)
        ? o.items.map((it: any) => ({
            id: it.id,
            orderId: o.id,
            productId: it.productId,
            productTitle: it.product?.title || 'Qurilish materiali',
            supplierId: it.product?.supplierId || 'sup-1',
            quantity: it.quantity,
            unit: it.unit as any,
            unitPrice: Number(it.unitPrice),
            totalPrice: Number(it.totalPrice),
          }))
        : [],
      totalAmount: Number(o.totalAmount),
      deliveryFee: Number(o.deliveryFee),
      discountAmount: Number(o.discountAmount || 0),
      finalAmount: Number(o.finalAmount),
      status: o.status as any,
      paymentMethod: 'CASH_ON_DELIVERY',
      paymentStatus: 'PENDING',
      deliveryAddress: {
        region: o.deliveryRegion || 'Toshkent shahri',
        district: o.deliveryDistrict || 'Chilonzor tumani',
        street: o.deliveryStreet || '',
      },
      vehicleType: o.vehicleType || 'Samosval (HOWO)',
      createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : (o.createdAt || new Date().toISOString()),
      updatedAt: o.updatedAt instanceof Date ? o.updatedAt.toISOString() : (o.updatedAt || new Date().toISOString()),
    };
  }

  async createOrder(payload: CreateOrderDto, actorUser?: CurrentUserPayload | null): Promise<Order> {
    const { items, deliveryAddress, vehicleType, buyerName, buyerPhone } = payload;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('Savatda mahsulotlar mavjud emas');
    }

    // 1. Resolve Buyer User
    let buyerId: string;
    if (actorUser?.id) {
      const dbUser = await this.prisma.user.findUnique({ where: { id: actorUser.id } });
      if (dbUser) {
        buyerId = dbUser.id;
      } else {
        buyerId = actorUser.id;
      }
    } else {
      const phoneToUse = buyerPhone || '+998901112233';
      let user = await this.prisma.user.findFirst({ where: { phone: phoneToUse } });
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            phone: phoneToUse,
            displayName: buyerName || 'Mijoz ' + phoneToUse.slice(-4),
            role: Role.CLIENT,
            userType: UserType.INDIVIDUAL,
            passwordHash: '$2b$10$temporaryGuestOrderPasswordHashBunker2026',
          },
        });
      }
      buyerId = user.id;
    }

    // 2. Execute within Prisma Interactive Transaction (ACID)
    const orderNumber = `BS-${Math.floor(100000 + Math.random() * 900000)}`;
    const deliveryFee = 150000;

    const createdOrder = await this.prisma.$transaction(async (tx) => {
      let calculatedTotal = 0;
      const orderItemsToCreate: Array<{
        productId: string;
        quantity: number;
        unit: string;
        unitPrice: number;
        totalPrice: number;
      }> = [];

      for (const it of items) {
        const product = await tx.product.findFirst({
          where: {
            OR: [{ id: it.productId }, { slug: it.productId }],
          },
        });

        if (!product) {
          throw new NotFoundException(`Mahsulot topilmadi: ${it.productId}`);
        }

        const qty = Math.max(1, it.quantity);
        if (product.stock < qty) {
          throw new BadRequestException(
            `Mahsulot zaxirada yetarli emas: ${product.title} (Omborda: ${product.stock}, So‘ralgan: ${qty})`
          );
        }

        // CWE-472 Price Tampering Fix: ALWAYS use official DB price
        const officialUnitPrice = Number(product.price);
        const lineTotal = officialUnitPrice * qty;
        calculatedTotal += lineTotal;

        // Decrement product stock in DB
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: { decrement: qty },
          },
        });

        orderItemsToCreate.push({
          productId: product.id,
          quantity: qty,
          unit: product.unit,
          unitPrice: officialUnitPrice,
          totalPrice: lineTotal,
        });
      }

      const calculatedFinal = calculatedTotal + deliveryFee;

      const order = await tx.order.create({
        data: {
          orderNumber,
          buyerId,
          totalAmount: calculatedTotal,
          deliveryFee,
          discountAmount: 0,
          finalAmount: calculatedFinal,
          status: OrderStatus.CONFIRMED,
          deliveryRegion: deliveryAddress.region,
          deliveryDistrict: deliveryAddress.district,
          deliveryStreet: deliveryAddress.street || null,
          deliveryLandmark: deliveryAddress.landmark || null,
          vehicleType: vehicleType || 'Samosval (HOWO)',
          items: {
            create: orderItemsToCreate,
          },
        },
        include: {
          buyer: true,
          items: {
            include: { product: true },
          },
        },
      });

      return order;
    });

    return this.mapPrismaOrder(createdOrder);
  }

  async findAll(currentUser?: CurrentUserPayload | null): Promise<Order[]> {
    const where: any = {};

    if (currentUser) {
      if (currentUser.role === Role.ADMIN) {
        // Admin sees all orders
      } else if (currentUser.role === Role.SUPPLIER) {
        // Supplier sees orders containing their supplied products
        where.items = {
          some: {
            product: {
              supplierId: currentUser.id,
            },
          },
        };
      } else {
        // Clients and Contractors see only their own orders
        where.buyerId = currentUser.id;
      }
    }

    try {
      const dbOrders = await this.prisma.order.findMany({
        where,
        include: {
          buyer: true,
          items: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return dbOrders.map((o) => this.mapPrismaOrder(o));
    } catch (err: any) {
      this.logger.warn(`Prisma OrdersService findAll error: ${err?.message}`);
      return [];
    }
  }

  async updateStatus(
    orderId: string,
    dto: UpdateOrderStatusDto,
    currentUser?: CurrentUserPayload | null
  ): Promise<Order> {
    const order = await this.prisma.order.findFirst({
      where: {
        OR: [{ id: orderId }, { orderNumber: orderId }],
      },
      include: {
        buyer: true,
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Buyurtma topilmadi: ${orderId}`);
    }

    if (currentUser && currentUser.role === Role.SUPPLIER) {
      const isSupplierItemInOrder = order.items.some(
        (it) => it.product?.supplierId === currentUser.id
      );
      if (!isSupplierItemInOrder) {
        throw new ForbiddenException('Ushbu buyurtma holatini o‘zgartirish huquqi yo‘q');
      }
    }

    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: { status: dto.status },
      include: {
        buyer: true,
        items: {
          include: { product: true },
        },
      },
    });

    return this.mapPrismaOrder(updated);
  }
}
