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
}
