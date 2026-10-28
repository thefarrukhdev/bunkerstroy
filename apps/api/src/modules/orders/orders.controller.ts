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
import { CreateOrderDto, UpdateOrderStatusDto, VerifyAcceptanceCodeDto, OpenDisputeDto } from './dto/order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Orders & Checkout')
@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Public()
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

  @Get('supplier/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPPLIER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sotuvchining barcha buyurtmalari (Admin va Ta\'minotchi uchun)' })
  async findSupplierOrders(@CurrentUser() user: CurrentUserPayload) {
    const data = await this.ordersService.findAll(user);
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bitta buyurtma tafsiloti' })
  async findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    const data = await this.ordersService.findOne(id, user);
    return { success: true, data };
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

  @Post(':id/arrived')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yuk manzilga yetib kelganini belgilash (Haydovchi / Admin)' })
  async markArrived(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    const data = await this.ordersService.markArrived(id, user);
    return {
      success: true,
      data,
      message: 'Yuk manzilga yetib keldi deb belgilandi. Kutish taymeri ishga tushirildi.',
    };
  }

  @Post(':id/verify-code')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mijoz qabul kodini tekshirish va yukni topshirish' })
  async verifyAcceptanceCode(
    @Param('id') id: string,
    @Body() dto: VerifyAcceptanceCodeDto,
    @CurrentUser() user: CurrentUserPayload
  ) {
    const data = await this.ordersService.verifyAcceptanceCode(id, dto, user);
    return {
      success: true,
      data,
      message: 'Qabul kodi tasdiqlandi. Yuk muvaffaqiyatli topshirildi!',
    };
  }

  @Post(':id/pay-second-half')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '50/50 buyurtmaning ikkinchi 50% qismini to‘lash' })
  async paySecondHalf(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    const data = await this.ordersService.paySecondHalf(id, user);
    return {
      success: true,
      data,
      message: 'Ikkinchi to‘lov muvaffaqiyatli bajarildi. Qabul kodi ochildi.',
    };
  }

  @Post(':id/dispute')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buyurtma bo‘yicha e‘tiroz (nizo) ochish' })
  async openDispute(
    @Param('id') id: string,
    @Body() dto: OpenDisputeDto,
    @CurrentUser() user: CurrentUserPayload
  ) {
    const data = await this.ordersService.openDispute(id, dto, user);
    return {
      success: true,
      data,
      message: 'Nizo muvaffaqiyatli qayd etildi. Administratorlar tez orada ko‘rib chiqishadi.',
    };
  }
}
