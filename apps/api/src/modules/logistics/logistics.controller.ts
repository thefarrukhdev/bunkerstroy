import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LogisticsService } from './logistics.service';

@ApiTags('Logistics & Fleet Transport')
@Controller('api/logistics')
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

  @Get('vehicles')
  @ApiOperation({ summary: 'Mavjud maxsus qurilish texnikalari ro‘yxati' })
  getVehicles() {
    const data = this.logisticsService.getVehicles();
    return { success: true, data };
  }

  @Post('calculate-quote')
  @ApiOperation({ summary: 'Masofa va vazn bo‘yicha transport xarajatini hisoblash' })
  calculateQuote(@Body() body: { vehicleId?: string; distanceKm: number; cargoWeightTons: number }) {
    const data = this.logisticsService.calculateQuote(
      body.vehicleId || 'veh-1',
      Number(body.distanceKm) || 10,
      Number(body.cargoWeightTons) || 1
    );
    return { success: true, data };
  }
}
