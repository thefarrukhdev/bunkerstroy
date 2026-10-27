import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role, VerificationStatus, SupplierType } from '@bunkerstroy/db';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Admin Analytics & Auditing')
@Controller('api/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('monitoring')
  @ApiOperation({ summary: 'Monitoring ekrani KPI kartalari, buyurtmalar va e‘tibor ro‘yxati (TZ-5 AD-02)' })
  async getMonitoring() {
    const data = await this.adminService.getMonitoringData();
    return { success: true, data };
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Aylanma, sof foyda va buyurtmalar ko‘rsatkichlari (Faqat ADMIN)' })
  async getMetrics() {
    const data = await this.adminService.getMetrics();
    return { success: true, data };
  }

  @Get('regions')
  @ApiOperation({ summary: 'O‘zbekiston viloyatlari bo‘yicha buyurtmalar va aylanma taqsimoti (Faqat ADMIN)' })
  async getRegions() {
    const data = await this.adminService.getRegionalBreakdown();
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

  @Post('suppliers/:id/verify')
  @ApiOperation({ summary: 'Ta‘minotchi arizasini tasdiqlash yoki rad etish' })
  async verifySupplier(
    @Param('id') id: string,
    @Body('status') status: VerificationStatus,
    @Body('supplierType') supplierType: SupplierType | undefined,
    @CurrentUser() user: CurrentUserPayload
  ) {
    const data = await this.adminService.verifySupplier(id, status, supplierType, user.id);
    return { success: true, data, message: 'Ta\'minotchi holati muvaffaqiyatli yangilandi' };
  }

  @Get('partners')
  @ApiOperation({ summary: 'Hamkorlar va integratsiyalar salomatligi holati (TZ-5 AD-07)' })
  async getPartners() {
    const data = await this.adminService.getPartners();
    return { success: true, data };
  }

  @Get('disputes')
  @ApiOperation({ summary: 'Ochiq va hal qilingan nizolar ro‘yxati (TZ-5 AD-10)' })
  async getDisputes() {
    const data = await this.adminService.getDisputes();
    return { success: true, data };
  }

  @Post('disputes/:id/resolve')
  @ApiOperation({ summary: 'Nizoni hal qilish va qaytarim belgilash (TZ-5 AD-10)' })
  async resolveDispute(
    @Param('id') id: string,
    @Body('resolution') resolution: 'RESOLVED_REFUND' | 'REJECTED',
    @Body('resolutionNote') resolutionNote: string,
    @Body('refundAmount') refundAmount: number | undefined,
    @CurrentUser() user: CurrentUserPayload
  ) {
    const data = await this.adminService.resolveDispute(id, resolution, resolutionNote, refundAmount, user.id);
    return { success: true, data, message: 'Nizo muvaffaqiyatli hal qilindi' };
  }

  @Post('clients/:id/split-payment')
  @ApiOperation({ summary: 'Mijozga 50/50 to‘lov ruxsatini berish yoki bekor qilish (TZ-5 AD-11)' })
  async setClientSplitPayment(
    @Param('id') id: string,
    @Body('isAllowed') isAllowed: boolean,
    @CurrentUser() user: CurrentUserPayload
  ) {
    const data = await this.adminService.setClientSplitPayment(id, isAllowed, user.id);
    return { success: true, data, message: `50/50 to'lov ruxsati yangilandi` };
  }
}
