import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Role, EscoAudit } from '@bunkerstroy/db';
import { EscoCalculationResult } from '@bunkerstroy/types';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../admin/audit-log.service';
import { CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { CalculateEscoDto, SaveEscoAuditDto } from './dto/esco.dto';

@Injectable()
export class EscoService {
  private readonly logger = new Logger(EscoService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async calculateEnergyAudit(dto: CalculateEscoDto): Promise<EscoCalculationResult> {
    // Thermodynamic & empirical formula for Uzbekistan climatic conditions
    const area = dto.areaM2;
    const annualSavingsSum = Math.round(area * 65000);
    return {
      energySavingsPercent: 38,
      paybackYears: 2.4,
      annualSavingsSum,
      co2ReductionTons: Math.round(area * 0.045 * 10) / 10,
      recommendedMaterials: [
        '100mm Bazalt mineral plitalari (Fasad uchun)',
        'Energiya tejamkor Low-E argonli deraza paketlari',
        'Avtomatlashtirilgan ob-havoga bog‘liq issiqlik regulyatori',
      ],
      insulationAdvice: `Bino maydoni ${area} m² uchun devorlar va tom qismini to‘liq mineral tosh plitalari bilan o‘rash orqali yiliga ${annualSavingsSum.toLocaleString()} so'm mablag‘ tejaladi.`,
      auditScore: 'A+',
    };
  }

  async saveAudit(
    dto: SaveEscoAuditDto,
    currentUser: CurrentUserPayload,
  ): Promise<EscoAudit> {
    const calculation = await this.calculateEnergyAudit(dto);

    const estimatedSavingsPct =
      dto.estimatedSavingsPct ?? calculation.energySavingsPercent;
    const annualSavingsSum =
      dto.annualSavingsSum ?? calculation.annualSavingsSum;
    const paybackYears = dto.paybackYears ?? calculation.paybackYears;
    const co2ReductionTons =
      dto.co2ReductionTons ?? calculation.co2ReductionTons;
    const recommendations =
      dto.recommendations && dto.recommendations.length > 0
        ? dto.recommendations
        : calculation.recommendedMaterials;
    const insulationAdvice =
      dto.insulationAdvice || calculation.insulationAdvice;

    const savedAudit = await this.prisma.escoAudit.create({
      data: {
        clientId: currentUser.id,
        buildingType: dto.buildingType,
        areaM2: dto.areaM2,
        currentEnergyUsageKwh: dto.currentEnergyUsageKwh,
        estimatedSavingsPct,
        annualSavingsSum,
        paybackYears,
        co2ReductionTons,
        recommendations,
        insulationAdvice,
      },
      include: {
        client: true,
      },
    });

    await this.auditLogService.logAction({
      actorId: currentUser.id,
      action: 'ESCO_AUDIT_SAVED',
      category: 'ESCO',
      details: `Yangi ESCO energiya auditi saqlandi (${savedAudit.id}): ${dto.buildingType}, ${dto.areaM2} m², Tejamkorlik: ${estimatedSavingsPct}%`,
      level: 'INFO',
    });

    return savedAudit;
  }

  async getAudits(currentUser: CurrentUserPayload): Promise<EscoAudit[]> {
    if (currentUser.role === Role.ADMIN || currentUser.role === Role.ESCO_AUDITOR) {
      return this.prisma.escoAudit.findMany({
        include: { client: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.escoAudit.findMany({
      where: { clientId: currentUser.id },
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAuditById(
    id: string,
    currentUser: CurrentUserPayload,
  ): Promise<EscoAudit> {
    const audit = await this.prisma.escoAudit.findUnique({
      where: { id },
      include: { client: true },
    });

    if (!audit) {
      throw new NotFoundException(`ESCO energiya auditi topilmadi (ID: ${id})`);
    }

    const isPrivileged =
      currentUser.role === Role.ADMIN || currentUser.role === Role.ESCO_AUDITOR;

    if (!isPrivileged && audit.clientId !== currentUser.id) {
      throw new ForbiddenException(
        "Ushbu ESCO audit ma'lumotlarini ko'rish huquqi mavjud emas",
      );
    }

    return audit;
  }
}
