import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import crypto from 'crypto';
import { PaymentProvider, PaymentStatus, OrderStatus } from '@bunkerstroy/db';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../admin/audit-log.service';
import { env } from '../../config/env';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  // ----------------------------------------------------
  // PAYME JSON-RPC 2.0 PROTOCOL
  // ----------------------------------------------------

  verifyPaymeAuth(authHeader?: string): boolean {
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return false;
    }

    try {
      const base64 = authHeader.replace(/^Basic\s+/i, '').trim();
      const decoded = Buffer.from(base64, 'base64').toString('utf-8');
      const [login, key] = decoded.split(':');

      if (login !== 'Paycom') {
        return false;
      }

      const validKeys = [env.PAYME_SECRET_KEY];
      if (env.NODE_ENV !== 'production') {
        validKeys.push('bunker_payme_test_secret_key_2026');
      }

      return !!(key && validKeys.includes(key));
    } catch {
      return false;
    }
  }

  private paymeError(code: number, messageUz: string, messageRu: string, id: any) {
    return {
      error: {
        code,
        message: {
          uz: messageUz,
          ru: messageRu,
          en: messageRu,
        },
      },
      id,
    };
  }

  async handlePaymeWebhook(authHeader: string | undefined, body: any) {
    const { method, params, id } = body || {};

    if (!this.verifyPaymeAuth(authHeader)) {
      return this.paymeError(
        -32504,
        'Metodni bajarish uchun yetarli huquqlar mavjud emas',
        'Недостаточно привилегий для выполнения метода',
        id
      );
    }

    switch (method) {
      case 'CheckPerformTransaction':
        return this.paymeCheckPerformTransaction(params, id);
      case 'CreateTransaction':
        return this.paymeCreateTransaction(params, body, id);
      case 'PerformTransaction':
        return this.paymePerformTransaction(params, id);
      case 'CancelTransaction':
        return this.paymeCancelTransaction(params, id);
      case 'CheckTransaction':
        return this.paymeCheckTransaction(params, id);
      default:
        return this.paymeError(
          -32601,
          'Metod topilmadi',
          'Запрашиваемый метод не найден',
          id
        );
    }
  }

  private async paymeCheckPerformTransaction(params: any, id: any) {
    const orderIdentifier = params?.account?.order_id || params?.account?.orderNumber;
    const amountInTiyin = Number(params?.amount);

    if (!orderIdentifier) {
      return this.paymeError(-31050, 'Buyurtma identifikatori kiritilmagan', 'Заказ не указан', id);
    }

    const order = await this.prisma.order.findFirst({
      where: {
        OR: [{ id: orderIdentifier }, { orderNumber: orderIdentifier }],
      },
    });

    if (!order) {
      return this.paymeError(-31050, 'Buyurtma topilmadi', 'Заказ не найден', id);
    }

    const expectedTiyin = Math.round(Number(order.finalAmount) * 100);
    if (amountInTiyin && Math.abs(amountInTiyin - expectedTiyin) > 100) {
      return this.paymeError(-31001, 'Noto‘g‘ri to‘lov summasi', 'Неверная сумма', id);
    }

    return {
      result: {
        allow: true,
      },
      id,
    };
  }

  private async paymeCreateTransaction(params: any, rawBody: any, id: any) {
    const transId = String(params?.id);
    const time = Number(params?.time) || Date.now();
    const orderIdentifier = params?.account?.order_id || params?.account?.orderNumber;
    const amountInTiyin = Number(params?.amount);

    // 1. Check if transaction already exists
    const existing = await this.prisma.paymentTransaction.findUnique({
      where: { transactionId: transId },
    });

    if (existing) {
      const state = existing.status === PaymentStatus.PAID ? 2 : (existing.status === PaymentStatus.PREAUTHORIZED ? 1 : -1);
      return {
        result: {
          create_time: existing.createdAt.getTime(),
          transaction: existing.transactionId,
          state,
        },
        id,
      };
    }

    // 2. Validate order
    const order = await this.prisma.order.findFirst({
      where: {
        OR: [{ id: orderIdentifier }, { orderNumber: orderIdentifier }],
      },
    });

    if (!order) {
      return this.paymeError(-31050, 'Buyurtma topilmadi', 'Заказ не найден', id);
    }

    const expectedTiyin = Math.round(Number(order.finalAmount) * 100);
    if (amountInTiyin && Math.abs(amountInTiyin - expectedTiyin) > 100) {
      return this.paymeError(-31001, 'Noto‘g‘ri to‘lov summasi', 'Неверная сумма', id);
    }

    // 3. Create PaymentTransaction with PREAUTHORIZED
    const newTx = await this.prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        provider: PaymentProvider.PAYME,
        transactionId: transId,
        amount: order.finalAmount,
        status: PaymentStatus.PREAUTHORIZED,
        rawWebhookData: rawBody,
      },
    });

    return {
      result: {
        create_time: newTx.createdAt.getTime() || time,
        transaction: transId,
        state: 1,
      },
      id,
    };
  }

  private async paymePerformTransaction(params: any, id: any) {
    const transId = String(params?.id);

    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { transactionId: transId },
      include: { order: true },
    });

    if (!transaction) {
      return this.paymeError(-31003, 'Tranzaksiya topilmadi', 'Транзакция не найдена', id);
    }

    if (transaction.status === PaymentStatus.PAID) {
      return {
        result: {
          transaction: transId,
          perform_time: transaction.updatedAt.getTime(),
          state: 2,
        },
        id,
      };
    }

    // Mark transaction as PAID and update Order status to CONFIRMED / FULLY_PAID
    const updated = await this.prisma.$transaction(async (tx) => {
      const p = await tx.paymentTransaction.update({
        where: { id: transaction.id },
        data: { status: PaymentStatus.PAID },
      });

      const orderDataToUpdate: any = {};
      if (transaction.paymentType === 'SECOND_50') {
        orderDataToUpdate.isSecondPaid = true;
        orderDataToUpdate.status = OrderStatus.FULLY_PAID;
        orderDataToUpdate.isAcceptanceCodeRevealed = true;
      } else if (transaction.paymentType === 'FIRST_50') {
        orderDataToUpdate.isFirstPaid = true;
        orderDataToUpdate.status = OrderStatus.CONFIRMED;
      } else {
        orderDataToUpdate.isFirstPaid = true;
        orderDataToUpdate.status = OrderStatus.CONFIRMED;
      }

      await tx.order.update({
        where: { id: transaction.orderId },
        data: orderDataToUpdate,
      });

      return p;
    });

    await this.auditLogService.logAction({
      action: 'PAYME_PAYMENT_SUCCESS',
      category: 'PAYMENT',
      details: `Payme to'lovi muvaffaqiyatli qabul qilindi: ${transId}, buyurtma: ${transaction.orderId}`,
      level: 'SUCCESS',
    });

    return {
      result: {
        transaction: transId,
        perform_time: updated.updatedAt.getTime(),
        state: 2,
      },
      id,
    };
  }

  private async paymeCancelTransaction(params: any, id: any) {
    const transId = String(params?.id);

    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { transactionId: transId },
    });

    if (!transaction) {
      return this.paymeError(-31003, 'Tranzaksiya topilmadi', 'Транзакция не найдена', id);
    }

    const isPaid = transaction.status === PaymentStatus.PAID;
    const newStatus = isPaid ? PaymentStatus.REFUNDED : PaymentStatus.FAILED;

    const updated = await this.prisma.$transaction(async (tx) => {
      const p = await tx.paymentTransaction.update({
        where: { id: transaction.id },
        data: { status: newStatus },
      });

      if (isPaid && transaction.orderId) {
        await tx.order.update({
          where: { id: transaction.orderId },
          data: { status: OrderStatus.CANCELLED },
        });
      }

      return p;
    });

    await this.auditLogService.logAction({
      action: 'PAYME_PAYMENT_CANCELLED',
      category: 'PAYMENT',
      details: `Payme to'lovi bekor qilindi (${newStatus}): ${transId}`,
      level: 'WARNING',
    });

    return {
      result: {
        transaction: transId,
        cancel_time: updated.updatedAt.getTime(),
        state: isPaid ? -2 : -1,
      },
      id,
    };
  }

  private async paymeCheckTransaction(params: any, id: any) {
    const transId = String(params?.id);

    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { transactionId: transId },
    });

    if (!transaction) {
      return this.paymeError(-31003, 'Tranzaksiya topilmadi', 'Транзакция не найдена', id);
    }

    const state =
      transaction.status === PaymentStatus.PAID
        ? 2
        : transaction.status === PaymentStatus.PREAUTHORIZED
        ? 1
        : -1;

    return {
      result: {
        create_time: transaction.createdAt.getTime(),
        perform_time: transaction.status === PaymentStatus.PAID ? transaction.updatedAt.getTime() : 0,
        cancel_time:
          transaction.status === PaymentStatus.FAILED || transaction.status === PaymentStatus.REFUNDED
            ? transaction.updatedAt.getTime()
            : 0,
        transaction: transId,
        state,
        reason: null,
      },
      id,
    };
  }

  // ----------------------------------------------------
  // CLICK MERCHANT PROTOCOL (MD5 HASH VALIDATION)
  // ----------------------------------------------------

  async handleClickWebhook(body: any) {
    const {
      click_trans_id,
      service_id,
      click_paydoc_id,
      merchant_trans_id,
      amount,
      action,
      error,
      error_note,
      sign_time,
      sign_string,
    } = body;

    // Validate MD5 Signature:
    // md5(click_trans_id + service_id + CLICK_SECRET_KEY + merchant_trans_id + amount + action + sign_time)
    const secretKey = env.CLICK_SECRET_KEY;
    const rawSign = `${click_trans_id}${service_id}${secretKey}${merchant_trans_id}${amount}${action}${sign_time}`;
    const expectedSign = crypto.createHash('md5').update(rawSign).digest('hex');

    if (!sign_string || sign_string.toLowerCase() !== expectedSign.toLowerCase()) {
      this.logger.warn(`Click signature mismatch: received ${sign_string}, expected ${expectedSign}`);
      return {
        click_trans_id,
        merchant_trans_id,
        error: -1,
        error_note: 'SIGN CHECK FAILED!',
      };
    }

    // Find Order
    const order = await this.prisma.order.findFirst({
      where: {
        OR: [{ id: merchant_trans_id }, { orderNumber: merchant_trans_id }],
      },
    });

    if (!order) {
      return {
        click_trans_id,
        merchant_trans_id,
        error: -5,
        error_note: 'User / Order does not exist',
      };
    }

    // Action 0: Prepare
    if (Number(action) === 0) {
      return {
        click_trans_id,
        merchant_trans_id,
        merchant_prepare_id: Date.now().toString(),
        error: 0,
        error_note: 'Success',
      };
    }

    // Action 1: Complete
    if (Number(action) === 1) {
      if (error && Number(error) < 0) {
        await this.prisma.paymentTransaction.upsert({
          where: { transactionId: String(click_trans_id) },
          update: {
            status: PaymentStatus.FAILED,
            rawWebhookData: body,
          },
          create: {
            orderId: order.id,
            provider: PaymentProvider.CLICK,
            transactionId: String(click_trans_id),
            amount: order.finalAmount,
            status: PaymentStatus.FAILED,
            rawWebhookData: body,
          },
        });

        await this.auditLogService.logAction({
          action: 'CLICK_PAYMENT_FAILED',
          category: 'PAYMENT',
          details: `Click to'lovi xato bilan yakunlandi (${error}: ${error_note}): ${click_trans_id}`,
          level: 'ERROR',
        });

        return {
          click_trans_id,
          merchant_trans_id,
          error: Number(error),
          error_note: error_note || 'Payment failed',
        };
      }

      await this.prisma.$transaction(async (tx) => {
        await tx.paymentTransaction.upsert({
          where: { transactionId: String(click_trans_id) },
          update: {
            status: PaymentStatus.PAID,
            rawWebhookData: body,
          },
          create: {
            orderId: order.id,
            provider: PaymentProvider.CLICK,
            transactionId: String(click_trans_id),
            amount: order.finalAmount,
            status: PaymentStatus.PAID,
            rawWebhookData: body,
          },
        });

        await tx.order.update({
          where: { id: order.id },
          data: {
            status: OrderStatus.CONFIRMED,
            isFirstPaid: true,
          },
        });
      });

      await this.auditLogService.logAction({
        action: 'CLICK_PAYMENT_SUCCESS',
        category: 'PAYMENT',
        details: `Click to'lovi muvaffaqiyatli yakunlandi: ${click_trans_id}, buyurtma: ${order.id}`,
        level: 'SUCCESS',
      });

      return {
        click_trans_id,
        merchant_trans_id,
        merchant_confirm_id: Date.now().toString(),
        error: 0,
        error_note: 'Success',
      };
    }

    return {
      click_trans_id,
      merchant_trans_id,
      error: -3,
      error_note: 'Action not found',
    };
  }

  async simulatePayment(orderId: string, provider: 'PAYME' | 'CLICK') {
    const order = await this.prisma.order.findFirst({
      where: {
        OR: [{ id: orderId }, { orderNumber: orderId }],
      },
    });

    if (!order) {
      throw new NotFoundException(`Buyurtma topilmadi: ${orderId}`);
    }

    const txId = `${provider.toLowerCase()}_tx_${Date.now()}`;
    const pProvider = provider === 'CLICK' ? PaymentProvider.CLICK : PaymentProvider.PAYME;

    const payment = await this.prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        provider: pProvider,
        transactionId: txId,
        amount: order.finalAmount,
        status: PaymentStatus.PAID,
        rawWebhookData: { simulated: true, time: new Date().toISOString() },
      },
    });

    await this.prisma.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.CONFIRMED },
    });

    await this.auditLogService.logAction({
      action: 'PAYMENT_SIMULATED',
      category: 'PAYMENT',
      details: `Test to‘lovi muvaffaqiyatli amalga oshirildi (${provider}, Buyurtma: ${order.orderNumber}, Summa: ${order.finalAmount})`,
      level: 'INFO',
    });

    return {
      success: true,
      transactionId: txId,
      orderNumber: order.orderNumber,
      status: 'PAID',
    };
  }
}
