import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Payment Gateways (Payme & Click)')
@Controller('api/payments')
export class PaymentsController {
  @Post('payme')
  @ApiOperation({ summary: 'Payme Merchant Webhook protokoli' })
  handlePaymeWebhook(@Body() body: any) {
    const { method, params } = body;
    if (method === 'CheckPerformTransaction') {
      return { result: { allow: true } };
    }
    if (method === 'CreateTransaction') {
      return { result: { create_time: Date.now(), transaction: params?.id, state: 1 } };
    }
    if (method === 'PerformTransaction') {
      return { result: { transaction: params?.id, perform_time: Date.now(), state: 2 } };
    }
    return { result: { success: true } };
  }

  @Post('click')
  @ApiOperation({ summary: 'Click Merchant Webhook protokoli' })
  handleClickWebhook(@Body() body: any) {
    const { click_trans_id, merchant_trans_id, action } = body;
    if (action === 0) {
      return {
        click_trans_id,
        merchant_trans_id,
        merchant_prepare_id: Date.now(),
        error: 0,
        error_note: 'Success'
      };
    }
    return {
      click_trans_id,
      merchant_trans_id,
      merchant_confirm_id: Date.now(),
      error: 0,
      error_note: 'Success'
    };
  }
}
