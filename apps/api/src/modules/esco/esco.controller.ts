import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EscoService } from './esco.service';
import { EscoAuditInput } from '@bunkerstroy/types';

@ApiTags('ESCO Energy Efficiency Audit')
@Controller('api/esco')
export class EscoController {
  constructor(private readonly escoService: EscoService) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Binoning energiya samaradorligi va tejamkorligini hisoblash' })
  async calculate(@Body() input: EscoAuditInput) {
    const data = await this.escoService.calculateEnergyAudit(input);
    return { success: true, data };
  }
}
