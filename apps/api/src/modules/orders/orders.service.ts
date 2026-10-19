import { Injectable, BadRequestException } from '@nestjs/common';
import crypto from 'crypto';
import { Order } from '@bunkerstroy/types';

@Injectable()
export class OrdersService {
  private orders: Order[] = [];

  createOrder(payload: any): Order {
    const { buyerName, buyerPhone, items, deliveryAddress, paymentMethod, vehicleType } = payload;
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('Savatda mahsulotlar mavjud emas');
    }
    if (!buyerPhone) {
      throw new BadRequestException('Telefon raqam kiritilishi shart');
    }

    let totalAmount = 0;
    const orderId = crypto.randomUUID();
    const orderNumber = `BS-${Date.now().toString().slice(-6)}`;

    const orderItems = items.map((it: any) => {
      const lineTotal = Number(it.price) * Number(it.quantity);
      totalAmount += lineTotal;
      return {
        id: crypto.randomUUID(),
        orderId,
        productId: it.productId || 'prod-custom',
        productTitle: it.title || 'Qurilish materiali',
        supplierId: it.supplierId || 'sup-1',
        quantity: Number(it.quantity),
        unit: it.unit || 'dona',
        unitPrice: Number(it.price),
        totalPrice: lineTotal
      };
    });

    const deliveryFee = 150000;
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
      finalAmount: totalAmount + deliveryFee,
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

    this.orders.unshift(newOrder);
    return newOrder;
  }

  findAll(): Order[] {
    return this.orders;
  }
}
