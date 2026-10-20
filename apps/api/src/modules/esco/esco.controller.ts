import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { EscoService } from './esco.service';
import { CalculateEscoDto, SaveEscoAuditDto } from './dto/esco.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('ESCO Energy Efficiency Audit')
@Controller('api/esco')
export class EscoController {
  constructor(private readonly escoService: EscoService) {}

  @SkipThrottle()
  @Public()
  @Post('calculate')
  @ApiOperation({
    summary: 'Binoning energiya samaradorligi va tejamkorligini hisoblash (saqlamasdan)',
  })
  async calculate(@Body() input: CalculateEscoDto) {
    const data = await this.escoService.calculateEnergyAudit(input);
    return { success: true, data };
  }

  @Post('audits')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'ESCO energiya auditi natijasini ma’lumotlar bazasida saqlash',
  })
  async saveAudit(
    @Body() body: SaveEscoAuditDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    const data = await this.escoService.saveAudit(body, user);
    return {
      success: true,
      data,
      message: 'ESCO energiya auditi muvaffaqiyatli saqlandi',
    };
  }

  @Get('audits')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Foydalanuvchi yoki admin uchun ESCO auditlari ro‘yxatini olish',
  })
  async getAudits(@CurrentUser() user: CurrentUserPayload) {
    const data = await this.escoService.getAudits(user);
    return { success: true, data };
  }

  @Get('audits/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Bitta ESCO auditi to‘liq ma’lumotlarini olish',
  })
  async getAuditById(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    const data = await this.escoService.getAuditById(id, user);
    return { success: true, data };
  }
}
