import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './orders.service';

@ApiTags('Orders & Checkout')
@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi buyurtma rasmiylashtirish' })
  create(@Body() payload: any) {
    const data = this.ordersService.createOrder(payload);
    return {
      success: true,
      data,
      message: `Buyurtma qabul qilindi. Raqami: ${data.orderNumber}`
    };
  }

  @Get()
  @ApiOperation({ summary: 'Buyurtmalar ro‘yxati' })
  findAll() {
    const data = this.ordersService.findAll();
    return { success: true, data, total: data.length };
  }
}
