import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('Admin Analytics & Auditing')
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Aylanma, sof foyda va buyurtmalar ko‘rsatkichlari' })
  getMetrics() {
    const data = this.adminService.getMetrics();
    return { success: true, data };
  }

  @Get('logs')
  @ApiOperation({ summary: 'Xavfsizlik va harakatlar audit jurnali' })
  getLogs() {
    const data = this.adminService.getLogs();
    return { success: true, data, total: data.length };
  }

  @Get('suppliers')
  @ApiOperation({ summary: 'Tasdiqlangan ta’minotchi korxonalar ro‘yxati' })
  getSuppliers() {
    const data = this.adminService.getSuppliers();
    return { success: true, data };
  }
}
