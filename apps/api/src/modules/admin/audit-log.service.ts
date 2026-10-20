import { Injectable, Logger } from '@nestjs/common';
import { SystemLog } from '@bunkerstroy/types';
import { PrismaService } from '../../prisma/prisma.service';

export interface LogActionParams {
  actorId?: string | null;
  action: string;
  category: string;
  details: string;
  ipAddress?: string | null;
  level?: string;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  private readonly initialLogs: SystemLog[] = [
    {
      id: 'log-1',
      action: 'Boshqaruv paneliga kirish',
      actor: 'Farrukh Jumayev (Admin)',
      category: 'AUTH',
      details: 'IP: 127.0.0.1 orqali muvaffaqiyatli kirildi',
      level: 'SUCCESS',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'log-2',
      action: 'STIR tekshirildi',
      actor: 'Soliq Gateway',
      category: 'SYSTEM_SECURITY',
      details: 'STIR: 201122334 «BUNKER STROY INVEST» MChJ faol',
      level: 'INFO',
      timestamp: new Date().toISOString(),
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async logAction(params: LogActionParams): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          actorId: params.actorId || null,
          action: params.action,
          category: params.category,
          details: params.details,
          ipAddress: params.ipAddress || null,
          level: params.level || 'INFO',
        },
      });
    } catch (err: any) {
      this.logger.warn(`AuditLogService save error: ${err?.message}`);
    }
  }

  async getLogs(limit = 50): Promise<SystemLog[]> {
    try {
      const dbLogs = await this.prisma.auditLog.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { actor: true },
      });

      if (dbLogs && dbLogs.length > 0) {
        return dbLogs.map((log) => ({
          id: log.id,
          action: log.action,
          actor: log.actor?.displayName || (log.actorId ? `User (${log.actorId.slice(-4)})` : 'Tizim'),
          category: (log.category as any) || 'SYSTEM_SECURITY',
          details: log.details,
          ipAddress: log.ipAddress || null,
          level: (log.level as any) || 'INFO',
          timestamp: log.createdAt.toISOString(),
        }));
      }
    } catch (err: any) {
      this.logger.warn(`AuditLogService getLogs warning: ${err?.message}`);
    }

    return this.initialLogs;
  }
}
