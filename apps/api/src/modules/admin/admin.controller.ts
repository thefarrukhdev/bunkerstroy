import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@bunkerstroy/db';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin Analytics & Auditing')
@Controller('api/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Aylanma, sof foyda va buyurtmalar ko‘rsatkichlari (Faqat ADMIN)' })
  async getMetrics() {
    const data = await this.adminService.getMetrics();
    return { success: true, data };
  }

  @Get('logs')
  @ApiOperation({ summary: 'Xavfsizlik va harakatlar audit jurnali (Faqat ADMIN)' })
  async getLogs() {
    const data = await this.adminService.getLogs();
    return { success: true, data, total: data.length };
  }

  @Get('suppliers')
  @ApiOperation({ summary: 'Tasdiqlangan ta’minotchi korxonalar ro‘yxati (Faqat ADMIN)' })
  async getSuppliers() {
    const data = await this.adminService.getSuppliers();
    return { success: true, data };
  }
}
