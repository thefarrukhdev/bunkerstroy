import { Controller, Post, Body, Headers, ForbiddenException, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { env } from '../../config/env';
import { IdempotencyInterceptor } from '../../common';

@ApiTags('Payment Gateways (Payme & Click)')
@UseInterceptors(IdempotencyInterceptor)
@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('payme')
  @ApiOperation({ summary: 'Payme Merchant Webhook protokoli (JSON-RPC 2.0 & Basic Auth)' })
  async handlePaymeWebhook(
    @Headers('authorization') authHeader: string | undefined,
    @Body() body: any
  ) {
    return this.paymentsService.handlePaymeWebhook(authHeader, body);
  }

  @Post('click')
  @ApiOperation({ summary: 'Click Merchant Webhook protokoli (MD5 Hash Signature & Prepare/Complete)' })
  async handleClickWebhook(@Body() body: any) {
    return this.paymentsService.handleClickWebhook(body);
  }

  @Post('simulate')
  @ApiOperation({ summary: 'Payme va Click to‘lovlarini tezkor simulyatsiya qilish (Test muhiti)' })
  async simulatePayment(@Body() body: { orderId: string; provider: 'PAYME' | 'CLICK' }) {
    if (env.NODE_ENV === 'production') {
      throw new ForbiddenException("Test to'lov simulyatsiyasi production muhitida taqiqlangan");
    }
    const data = await this.paymentsService.simulatePayment(body.orderId, body.provider || 'PAYME');
    return { success: true, data, message: "To'lov muvaffaqiyatli qabul qilindi" };
  }
}
