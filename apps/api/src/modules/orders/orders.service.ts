import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import crypto from 'crypto';
import { Role, OrderStatus, UserType, PaymentProvider, PaymentStatus, PaymentMode } from '@bunkerstroy/db';
import { Order, OrderItem, SubOrder, Dispute } from '@bunkerstroy/types';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../admin/audit-log.service';
import { CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { CreateOrderDto, UpdateOrderStatusDto, VerifyAcceptanceCodeDto, OpenDisputeDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  private mapPrismaOrder(o: any): Order {
    const payments = Array.isArray(o.payments) ? o.payments : [];
    const hasPaidPayment = payments.some((p: any) => p.status === PaymentStatus.PAID);
    const latestPayment = payments[0] || null;

    let paymentStatus: any = 'PENDING';
    if (hasPaidPayment) {
      paymentStatus = 'PAID';
    } else if (latestPayment?.status) {
      paymentStatus = latestPayment.status;
    }

    const paymentMethod: any = latestPayment?.provider || 'CASH_ON_DELIVERY';

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
            subOrderId: it.subOrderId || undefined,
            productId: it.productId,
            productTitle: it.product?.title || 'Qurilish materiali',
            supplierId: it.product?.supplierId || 'sup-1',
            quantity: it.quantity,
            unit: it.unit as any,
            unitPrice: Number(it.unitPrice),
            totalPrice: Number(it.totalPrice),
          }))
        : [],
      subOrders: Array.isArray(o.subOrders)
        ? o.subOrders.map((so: any) => ({
            id: so.id,
            orderId: so.orderId,
            supplierId: so.supplierId,
            supplierName: so.supplier?.displayName || so.supplier?.companyName || 'Ta\'minotchi',
            status: so.status as any,
            subTotal: Number(so.subTotal),
            deliveryFee: Number(so.deliveryFee),
            acceptanceCode: so.acceptanceCode,
            arrivedAt: so.arrivedAt ? so.arrivedAt.toISOString() : null,
            completedAt: so.completedAt ? so.completedAt.toISOString() : null,
            driverId: so.driverId,
            driverName: so.driver?.displayName || null,
            driverPhone: so.driver?.phone || null,
            createdAt: so.createdAt ? so.createdAt.toISOString() : undefined,
            updatedAt: so.updatedAt ? so.updatedAt.toISOString() : undefined,
          }))
        : [],
      totalAmount: Number(o.totalAmount),
      deliveryFee: Number(o.deliveryFee),
      discountAmount: Number(o.discountAmount || 0),
      finalAmount: Number(o.finalAmount),
      status: o.status as any,
      paymentMode: (o.paymentMode as any) || 'FULL_100',
      firstPaymentAmount: o.firstPaymentAmount ? Number(o.firstPaymentAmount) : null,
      secondPaymentAmount: o.secondPaymentAmount ? Number(o.secondPaymentAmount) : null,
      isFirstPaid: Boolean(o.isFirstPaid),
      isSecondPaid: Boolean(o.isSecondPaid),
      acceptanceCode: o.isAcceptanceCodeRevealed ? o.acceptanceCode : null,
      isAcceptanceCodeRevealed: Boolean(o.isAcceptanceCodeRevealed),
      arrivedAt: o.arrivedAt instanceof Date ? o.arrivedAt.toISOString() : null,
      waitingDeadline: o.waitingDeadline instanceof Date ? o.waitingDeadline.toISOString() : null,
      paymentMethod,
      paymentStatus,
      deliveryAddress: {
        region: o.deliveryRegion || 'Toshkent shahri',
        district: o.deliveryDistrict || 'Chilonzor tumani',
        street: o.deliveryStreet || '',
        landmark: o.deliveryLandmark || '',
      },
      vehicleType: o.vehicleType || 'Samosval (HOWO)',
      trackingCode: o.orderNumber,
      paymentTransactionId: latestPayment?.transactionId || null,
      disputes: Array.isArray(o.disputes)
        ? o.disputes.map((d: any) => ({
            id: d.id,
            orderId: d.orderId,
            openedById: d.openedById,
            openedByName: d.openedBy?.displayName || null,
            reason: d.reason,
            evidenceUrls: d.evidenceUrls || [],
            status: d.status as any,
            resolutionNote: d.resolutionNote,
            refundAmount: d.refundAmount ? Number(d.refundAmount) : null,
            resolvedAt: d.resolvedAt ? d.resolvedAt.toISOString() : null,
            createdAt: d.createdAt.toISOString(),
            updatedAt: d.updatedAt.toISOString(),
          }))
        : [],
      createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : (o.createdAt || new Date().toISOString()),
      updatedAt: o.updatedAt instanceof Date ? o.updatedAt.toISOString() : (o.updatedAt || new Date().toISOString()),
    };
  }

  async createOrder(payload: CreateOrderDto, actorUser?: CurrentUserPayload | null): Promise<Order> {
    const { items, deliveryAddress, vehicleType, buyerName, buyerPhone, paymentMode } = payload;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('Savatda mahsulotlar mavjud emas');
    }

    // 1. Resolve Buyer User & 50/50 permission check
    let buyerId: string;
    let isAllowedSplit = false;

    if (actorUser?.id) {
      const dbUser = await this.prisma.user.findUnique({ where: { id: actorUser.id } });
      if (dbUser) {
        buyerId = dbUser.id;
        isAllowedSplit = dbUser.isAllowedSplitPayment || dbUser.userType === UserType.LEGAL_ENTITY;
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
      isAllowedSplit = user.isAllowedSplitPayment || user.userType === UserType.LEGAL_ENTITY;
    }

    const selectedPaymentMode = paymentMode === PaymentMode.SPLIT_50_50 ? PaymentMode.SPLIT_50_50 : PaymentMode.FULL_100;
    if (selectedPaymentMode === PaymentMode.SPLIT_50_50 && !isAllowedSplit) {
      throw new BadRequestException('50/50 to‘lov rejimi faqat tasdiqlangan yuridik shaxslar (B2B) uchun amal qiladi');
    }

    // 2. Consolidate and validate items
    const consolidatedMap = new Map<string, number>();
    for (const it of items) {
      const current = consolidatedMap.get(it.productId) || 0;
      consolidatedMap.set(it.productId, current + Math.max(1, it.quantity));
    }

    // 3. Generate random secure 4-digit acceptance PIN
    const acceptanceCode = Math.floor(1000 + Math.random() * 9000).toString();
    const orderNumber = `BS-${Math.floor(100000 + Math.random() * 900000)}`;
    const deliveryFee = 150000;

    // 4. Interactive Transaction
    const createdOrder = await this.prisma.$transaction(async (tx) => {
      let calculatedTotal = 0;
      const orderItemsToCreate: Array<{
        productId: string;
        supplierId: string;
        quantity: number;
        unit: string;
        unitPrice: number;
        totalPrice: number;
      }> = [];

      // Map to group items by supplier for multi-vendor shipments
      const supplierItemsMap = new Map<string, { subTotal: number; items: any[] }>();

      for (const [productId, qty] of consolidatedMap.entries()) {
        const product = await tx.product.findFirst({
          where: {
            OR: [{ id: productId }, { slug: productId }],
          },
          include: {
            tieredPrices: true,
          },
        });

        if (!product) {
          throw new NotFoundException(`Mahsulot topilmadi: ${productId}`);
        }

        // Concurrency-safe stock decrement
        const updateResult = await tx.product.updateMany({
          where: {
            id: product.id,
            stock: { gte: qty },
          },
          data: {
            stock: { decrement: qty },
          },
        });

        if (updateResult.count === 0) {
          throw new BadRequestException(
            `Mahsulot zaxirada yetarli emas: ${product.title} (Omborda: ${product.stock}, So‘ralgan: ${qty})`
          );
        }

        // Determine official price with Tiered Pricing lookup
        let officialUnitPrice = Number(product.price);
        if (product.tieredPrices && product.tieredPrices.length > 0) {
          const matchedTier = product.tieredPrices.find(
            (tp) => qty >= tp.minQty && (!tp.maxQty || qty <= tp.maxQty)
          );
          if (matchedTier) {
            officialUnitPrice = Number(matchedTier.price);
          }
        }

        const lineTotal = officialUnitPrice * qty;
        calculatedTotal += lineTotal;

        const itemObj = {
          productId: product.id,
          supplierId: product.supplierId,
          quantity: qty,
          unit: product.unit,
          unitPrice: officialUnitPrice,
          totalPrice: lineTotal,
        };
        orderItemsToCreate.push(itemObj);

        // Group by supplier
        const supGroup = supplierItemsMap.get(product.supplierId) || { subTotal: 0, items: [] };
        supGroup.subTotal += lineTotal;
        supGroup.items.push(itemObj);
        supplierItemsMap.set(product.supplierId, supGroup);
      }

      const calculatedFinal = calculatedTotal + deliveryFee;
      let firstPaymentAmount = calculatedFinal;
      let secondPaymentAmount = 0;

      if (selectedPaymentMode === PaymentMode.SPLIT_50_50) {
        firstPaymentAmount = Math.round(calculatedFinal / 2);
        secondPaymentAmount = calculatedFinal - firstPaymentAmount;
      }

      const order = await tx.order.create({
        data: {
          orderNumber,
          buyerId,
          totalAmount: calculatedTotal,
          deliveryFee,
          discountAmount: 0,
          finalAmount: calculatedFinal,
          status: OrderStatus.PENDING_PAYMENT,
          paymentMode: selectedPaymentMode,
          firstPaymentAmount,
          secondPaymentAmount,
          isFirstPaid: false,
          isSecondPaid: false,
          acceptanceCode,
          isAcceptanceCodeRevealed: false,
          deliveryRegion: deliveryAddress.region,
          deliveryDistrict: deliveryAddress.district,
          deliveryStreet: deliveryAddress.street || null,
          deliveryLandmark: deliveryAddress.landmark || null,
          vehicleType: vehicleType || 'Samosval (HOWO)',
          items: {
            create: orderItemsToCreate.map((it) => ({
              productId: it.productId,
              quantity: it.quantity,
              unit: it.unit,
              unitPrice: it.unitPrice,
              totalPrice: it.totalPrice,
            })),
          },
        },
        include: {
          buyer: true,
          items: {
            include: { product: true },
          },
          subOrders: true,
          payments: true,
        },
      });

      // Create multi-vendor SubOrder records
      for (const [supId, group] of supplierItemsMap.entries()) {
        await tx.subOrder.create({
          data: {
            orderId: order.id,
            supplierId: supId,
            status: OrderStatus.PENDING_PAYMENT,
            subTotal: group.subTotal,
            deliveryFee: Math.round(deliveryFee / supplierItemsMap.size),
            acceptanceCode,
          },
        });
      }

      // Initial PaymentTransaction
      const amountToPayFirst = selectedPaymentMode === PaymentMode.SPLIT_50_50 ? firstPaymentAmount : calculatedFinal;
      const provider = payload.paymentMethod === 'CLICK' ? PaymentProvider.CLICK : PaymentProvider.PAYME;

      await tx.paymentTransaction.create({
        data: {
          orderId: order.id,
          provider,
          paymentType: selectedPaymentMode === PaymentMode.SPLIT_50_50 ? 'FIRST_50' : 'FULL',
          transactionId: `TX-${orderNumber}-P1`,
          amount: amountToPayFirst,
          status: PaymentStatus.PENDING,
          qrReceiptUrl: `https://bunkerstroy.uz/receipt/${order.id}`,
        },
      });

      return tx.order.findUniqueOrThrow({
        where: { id: order.id },
        include: {
          buyer: true,
          items: { include: { product: true } },
          subOrders: { include: { supplier: true, driver: true } },
          payments: true,
          disputes: true,
        },
      });
    });

    await this.auditLogService.logAction({
      actorId: buyerId,
      action: 'ORDER_CREATED',
      category: 'ORDER',
      details: `Yangi buyurtma yaratildi: ${createdOrder.orderNumber}, Rejim: ${createdOrder.paymentMode}, Summa: ${createdOrder.finalAmount} so'm`,
      level: 'INFO',
    });

    return this.mapPrismaOrder(createdOrder);
  }

  async findAll(currentUser?: CurrentUserPayload | null): Promise<Order[]> {
    if (!currentUser || !currentUser.id) {
      throw new UnauthorizedException('Avtorizatsiya talab qilinadi');
    }

    const where: any = {};
    if (currentUser.role === Role.ADMIN) {
      // Admin sees all
    } else if (currentUser.role === Role.CLIENT) {
      where.buyerId = currentUser.id;
    } else if (currentUser.role === Role.SUPPLIER) {
      where.items = {
        some: {
          product: {
            supplierId: currentUser.id,
          },
        },
      };
    } else if (currentUser.role === Role.LOGISTICS_DRIVER) {
      where.OR = [
        { dispatches: { some: { driverId: currentUser.id } } },
        { subOrders: { some: { driverId: currentUser.id } } },
      ];
    }

    const orders = await this.prisma.order.findMany({
      where,
      include: {
        buyer: true,
        items: { include: { product: true } },
        subOrders: { include: { supplier: true, driver: true } },
        payments: true,
        disputes: { include: { openedBy: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((o) => this.mapPrismaOrder(o));
  }

  async findOne(id: string, currentUser?: CurrentUserPayload | null): Promise<Order> {
    const order = await this.prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        buyer: true,
        items: { include: { product: true } },
        subOrders: { include: { supplier: true, driver: true } },
        payments: true,
        disputes: { include: { openedBy: true } },
      },
    });

    if (!order) {
      throw new NotFoundException(`Buyurtma topilmadi: ${id}`);
    }

    if (currentUser && currentUser.role !== Role.ADMIN) {
      const isBuyer = order.buyerId === currentUser.id;
      const isSupplier = order.items.some((it) => it.product?.supplierId === currentUser.id);
      const isDriver = order.subOrders.some((so) => so.driverId === currentUser.id);
      if (!isBuyer && !isSupplier && !isDriver) {
        throw new ForbiddenException('Ushbu buyurtmani ko‘rish uchun ruxsat mavjud emas');
      }
    }

    return this.mapPrismaOrder(order);
  }

  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
    currentUser?: CurrentUserPayload | null
  ): Promise<Order> {
    const order = await this.prisma.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
      include: { buyer: true },
    });

    if (!order) {
      throw new NotFoundException(`Buyurtma topilmadi: ${id}`);
    }

    const prevStatus = order.status;
    const newStatus = dto.status;

    // Admin can update freely, suppliers can mark ACCEPTED / PACKING or CANCELLED (reject)
    if (currentUser && currentUser.role === Role.SUPPLIER) {
      if (
        newStatus !== OrderStatus.ACCEPTED &&
        newStatus !== OrderStatus.PACKING &&
        newStatus !== OrderStatus.CANCELLED
      ) {
        throw new ForbiddenException('Ta\'minotchi faqat TASDIQLASH, YIG‘ISH yoki BEKOR QILISH holatini belgilashi mumkin');
      }
    }

    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: newStatus,
        isAcceptanceCodeRevealed:
          newStatus === OrderStatus.FULLY_PAID ||
          (newStatus === OrderStatus.ARRIVED && order.paymentMode === PaymentMode.FULL_100),
      },
      include: {
        buyer: true,
        items: { include: { product: true } },
        subOrders: { include: { supplier: true, driver: true } },
        payments: true,
        disputes: true,
      },
    });

    await this.auditLogService.logAction({
      actorId: currentUser?.id || 'SYSTEM',
      action: 'ORDER_STATUS_UPDATED',
      category: 'ORDER',
      details: `Buyurtma holati o‘zgardi: ${prevStatus} -> ${newStatus}. Sabab: ${dto.reason || 'Rejali bosqich'}`,
      previousState: { status: prevStatus },
      newState: { status: newStatus },
      level: 'INFO',
    });

    return this.mapPrismaOrder(updated);
  }

  async markArrived(orderId: string, currentUser?: CurrentUserPayload | null): Promise<Order> {
    const order = await this.prisma.order.findFirst({
      where: { OR: [{ id: orderId }, { orderNumber: orderId }] },
      include: { buyer: true },
    });

    if (!order) {
      throw new NotFoundException(`Buyurtma topilmadi: ${orderId}`);
    }

    const arrivedAt = new Date();
    const waitingDeadline = new Date(Date.now() + 30 * 60 * 1000); // 30 mins waiting countdown

    const revealCode = order.paymentMode === PaymentMode.FULL_100 || order.isSecondPaid;

    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.ARRIVED,
        arrivedAt,
        waitingDeadline,
        isAcceptanceCodeRevealed: revealCode,
      },
      include: {
        buyer: true,
        items: { include: { product: true } },
        subOrders: { include: { supplier: true, driver: true } },
        payments: true,
        disputes: true,
      },
    });

    await this.auditLogService.logAction({
      actorId: currentUser?.id || 'DRIVER',
      action: 'ORDER_ARRIVED',
      category: 'LOGISTICS',
      details: `Yuk manzilga yetib keldi: ${order.orderNumber}. Kutish vaqti: 30 daqiqa`,
      level: 'INFO',
    });

    return this.mapPrismaOrder(updated);
  }

  async verifyAcceptanceCode(
    orderId: string,
    dto: VerifyAcceptanceCodeDto,
    currentUser?: CurrentUserPayload | null
  ): Promise<Order> {
    const order = await this.prisma.order.findFirst({
      where: { OR: [{ id: orderId }, { orderNumber: orderId }] },
    });

    if (!order) {
      throw new NotFoundException(`Buyurtma topilmadi: ${orderId}`);
    }

    if (!dto.code || typeof dto.code !== 'string') {
      throw new BadRequestException('Qabul kodi kiritilmadi');
    }

    if (order.paymentMode === PaymentMode.SPLIT_50_50 && !order.isSecondPaid) {
      throw new BadRequestException('Ikkinchi 50% to‘lov hali to‘lanmagan. Yukni topshirish mumkin emas!');
    }

    if (order.acceptanceCode !== dto.code.trim()) {
      throw new BadRequestException('Kiritilgan qabul kodi noto‘g‘ri! Iltimos, mijozdan to‘g‘ri PIN kodni oling.');
    }

    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.RECEIVED,
      },
      include: {
        buyer: true,
        items: { include: { product: true } },
        subOrders: { include: { supplier: true, driver: true } },
        payments: true,
        disputes: true,
      },
    });

    // Mark completed & release escrow
    await this.prisma.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.COMPLETED },
    });

    await this.auditLogService.logAction({
      actorId: currentUser?.id || 'DRIVER',
      action: 'ORDER_RECEIVED_VERIFIED',
      category: 'ESCROW',
      details: `Qabul kodi tasdiqlandi (${dto.code}). Yuk muvaffaqiyatli topshirildi va Escrow mablag‘lari ajratildi: ${order.orderNumber}`,
      level: 'INFO',
    });

    return this.mapPrismaOrder(updated);
  }

  async paySecondHalf(orderId: string, currentUser?: CurrentUserPayload | null): Promise<Order> {
    const order = await this.prisma.order.findFirst({
      where: { OR: [{ id: orderId }, { orderNumber: orderId }] },
    });

    if (!order) {
      throw new NotFoundException(`Buyurtma topilmadi: ${orderId}`);
    }

    if (order.paymentMode !== PaymentMode.SPLIT_50_50) {
      throw new BadRequestException('Bu buyurtma 50/50 rejimida emas');
    }

    if (order.isSecondPaid) {
      throw new BadRequestException('Ikkinchi to‘lov allaqachon amalga oshirilgan');
    }

    const amount = Number(order.secondPaymentAmount || Math.round(Number(order.finalAmount) / 2));

    await this.prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        provider: PaymentProvider.PAYME,
        paymentType: 'SECOND_50',
        transactionId: `TX-${order.orderNumber}-P2`,
        amount,
        status: PaymentStatus.PAID,
        qrReceiptUrl: `https://bunkerstroy.uz/receipt/${order.id}-p2`,
      },
    });

    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        isSecondPaid: true,
        status: OrderStatus.FULLY_PAID,
        isAcceptanceCodeRevealed: true,
      },
      include: {
        buyer: true,
        items: { include: { product: true } },
        subOrders: { include: { supplier: true, driver: true } },
        payments: true,
        disputes: true,
      },
    });

    await this.auditLogService.logAction({
      actorId: currentUser?.id || order.buyerId,
      action: 'SECOND_PAYMENT_COMPLETED',
      category: 'PAYMENT',
      details: `Ikkinchi 50% to‘lov qabul qilindi (${amount} so'm). Qabul kodi mijozga ochildi: ${order.orderNumber}`,
      level: 'INFO',
    });

    return this.mapPrismaOrder(updated);
  }

  async openDispute(orderId: string, dto: OpenDisputeDto, currentUser?: CurrentUserPayload | null): Promise<Dispute> {
    if (!currentUser || !currentUser.id) {
      throw new UnauthorizedException('Avtorizatsiya talab qilinadi');
    }

    const order = await this.prisma.order.findFirst({
      where: { OR: [{ id: orderId }, { orderNumber: orderId }] },
    });

    if (!order) {
      throw new NotFoundException(`Buyurtma topilmadi: ${orderId}`);
    }

    const dispute = await this.prisma.dispute.create({
      data: {
        orderId: order.id,
        openedById: currentUser.id,
        reason: dto.reason,
        evidenceUrls: dto.evidenceUrls || [],
        status: 'OPEN',
      },
      include: { openedBy: true },
    });

    await this.prisma.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.DISPUTE },
    });

    await this.auditLogService.logAction({
      actorId: currentUser.id,
      action: 'DISPUTE_OPENED',
      category: 'DISPUTE',
      details: `Buyurtma bo‘yicha nizo ochildi (${order.orderNumber}): ${dto.reason}`,
      level: 'WARN',
    });

    return {
      id: dispute.id,
      orderId: dispute.orderId,
      openedById: dispute.openedById,
      openedByName: dispute.openedBy.displayName,
      reason: dispute.reason,
      evidenceUrls: dispute.evidenceUrls,
      status: dispute.status as any,
      resolutionNote: dispute.resolutionNote,
      refundAmount: dispute.refundAmount ? Number(dispute.refundAmount) : null,
      resolvedAt: dispute.resolvedAt ? dispute.resolvedAt.toISOString() : null,
      createdAt: dispute.createdAt.toISOString(),
      updatedAt: dispute.updatedAt.toISOString(),
    };
  }
}
