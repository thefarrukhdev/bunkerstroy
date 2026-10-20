import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@bunkerstroy/db';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Orders & Checkout')
@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi buyurtma rasmiylashtirish (Tranzaksion zaxira va narx nazorati)' })
  async create(
    @Body() payload: CreateOrderDto,
    @CurrentUser() user?: CurrentUserPayload | null
  ) {
    const data = await this.ordersService.createOrder(payload, user);
    return {
      success: true,
      data,
      message: `Buyurtma qabul qilindi. Raqami: ${data.orderNumber}`,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Foydalanuvchi buyurtmalari (Admin barcha buyurtmalarni ko‘radi)' })
  async findAll(@CurrentUser() user: CurrentUserPayload) {
    const data = await this.ordersService.findAll(user);
    return { success: true, data, total: data.length };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPPLIER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buyurtma holatini yangilash (ADMIN va SUPPLIER uchun)' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentUser() user: CurrentUserPayload
  ) {
    const data = await this.ordersService.updateStatus(id, dto, user);
    return {
      success: true,
      data,
      message: `Buyurtma holati "${data.status}" ga o‘zgartirildi`,
    };
  }
}
