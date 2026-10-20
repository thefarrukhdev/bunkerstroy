import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('Payment Gateways (Payme & Click)')
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
}
