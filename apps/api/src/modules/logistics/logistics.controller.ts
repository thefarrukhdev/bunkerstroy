import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@bunkerstroy/db';
import { LogisticsService } from './logistics.service';
import {
  CalculateQuoteDto,
  DispatchOrderDto,
  UpdateDispatchStatusDto,
} from './dto/logistics.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../../common/decorators/current-user.decorator';

@ApiTags('Logistics & Fleet Transport')
@Controller('api/logistics')
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

  @Get('vehicles')
  @ApiOperation({
    summary: 'Mavjud maxsus qurilish texnikalari ro‘yxati (Prisma PostgreSQL)',
  })
  async getVehicles() {
    const data = await this.logisticsService.getVehicles();
    return { success: true, data };
  }

  @Post('calculate-quote')
  @ApiOperation({
    summary: 'Masofa va vazn bo‘yicha transport xarajatini hisoblash',
  })
  async calculateQuote(@Body() body: CalculateQuoteDto) {
    const data = await this.logisticsService.calculateQuote(body);
    return { success: true, data };
  }

  @Post('dispatch')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.LOGISTICS_DRIVER, Role.CLIENT, Role.CONTRACTOR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buyurtmaga transport va haydovchi biriktirish (Dispatch yaratish)',
  })
  async dispatchOrder(
    @Body() body: DispatchOrderDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    const data = await this.logisticsService.dispatchOrder(body, user);
    return {
      success: true,
      data,
      message: 'Buyurtmaga maxsus texnika muvaffaqiyatli biriktirildi',
    };
  }

  @Get('dispatches')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.LOGISTICS_DRIVER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Dispetcherlik ro‘yxatini olish (Admin va Haydovchilar)',
  })
  async getDispatches(@CurrentUser() user: CurrentUserPayload) {
    const data = await this.logisticsService.getDispatches(user);
    return { success: true, data };
  }

  @Patch('dispatches/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.LOGISTICS_DRIVER)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Dispetcherlik holatini yangilash (ASSIGNED, IN_TRANSIT, DELIVERED, CANCELLED)',
  })
  async updateDispatchStatus(
    @Param('id') id: string,
    @Body() body: UpdateDispatchStatusDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    const data = await this.logisticsService.updateDispatchStatus(
      id,
      body.status,
      user,
    );
    return {
      success: true,
      data,
      message: 'Dispetcherlik holati muvaffaqiyatli yangilandi',
    };
  }

  @Post('dispatches/:id/driver-loaded')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.LOGISTICS_DRIVER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Haydovchi yukni yuklaganini belgilash (foto biriktirish)' })
  async driverMarkLoaded(
    @Param('id') id: string,
    @Body('photoUrl') photoUrl: string | undefined,
    @CurrentUser() user: CurrentUserPayload
  ) {
    const data = await this.logisticsService.driverMarkLoaded(id, photoUrl, user);
    return { success: true, data, message: 'Yuk yuklandi va yo‘lga chiqildi' };
  }

  @Post('dispatches/:id/driver-arrived')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.LOGISTICS_DRIVER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Haydovchi yetib kelganini belgilash (30 min taymer ishga tushadi)' })
  async driverMarkArrived(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload
  ) {
    const data = await this.logisticsService.driverMarkArrived(id, user);
    return { success: true, data, message: 'Yetib kelish belgilandi. Taymer faollashtirildi.' };
  }

  @Post('dispatches/:id/driver-verify-code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.LOGISTICS_DRIVER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Haydovchi mijoz qabul kodini kiritishi va topshirishi' })
  async driverVerifyAcceptanceCode(
    @Param('id') id: string,
    @Body('code') code: string,
    @Body('photoUrl') photoUrl: string | undefined,
    @CurrentUser() user: CurrentUserPayload
  ) {
    const data = await this.logisticsService.driverVerifyAcceptanceCode(id, code, photoUrl, user);
    return { success: true, data, message: 'Qabul kodi tasdiqlandi. Yuk muvaffaqiyatli topshirildi!' };
  }

  @Post('dispatches/:id/driver-report-issue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.LOGISTICS_DRIVER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Haydovchi muammo qayd etishi (kechikish, shikastlanish, mijoz topilmadi)' })
  async driverReportIssue(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Body('photoUrl') photoUrl: string | undefined,
    @CurrentUser() user: CurrentUserPayload
  ) {
    const data = await this.logisticsService.driverReportIssue(id, reason, photoUrl, user);
    return { success: true, data, message: 'Muammo muvaffaqiyatli qayd etildi va adminga yuborildi.' };
  }
}
