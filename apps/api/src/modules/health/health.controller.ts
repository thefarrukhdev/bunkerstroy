import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

@ApiTags('Health')
@Controller(['health', 'api/health'])
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Tizim salomatligi va servislar ulanish holatini tekshirish' })
  @ApiResponse({ status: 200, description: 'Tizim to‘liq ishchi holatda' })
  @ApiResponse({ status: 503, description: 'Bir yoki bir nechta tizim qismlari ishlamayapti' })
  async checkHealth(@Res() res: Response) {
    const startTime = Date.now();
    let dbStatus = 'healthy';
    let redisStatus = 'healthy';
    let isHealthy = true;

    // 1. Check PostgreSQL via Prisma
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (err: any) {
      dbStatus = `unhealthy: ${err?.message || 'DB query failed'}`;
      isHealthy = false;
    }

    // 2. Check Redis
    try {
      const testKey = 'health:ping:' + Date.now();
      await this.redis.set(testKey, 'pong', 5);
      const val = await this.redis.get(testKey);
      if (val !== 'pong') {
        redisStatus = 'degraded (fallback active)';
      }
    } catch (err: any) {
      redisStatus = `degraded: ${err?.message}`;
    }

    const latencyMs = Date.now() - startTime;
    const memory = process.memoryUsage();

    const responsePayload = {
      status: isHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      latencyMs,
      services: {
        database: {
          status: dbStatus,
          provider: 'PostgreSQL 16 (PostGIS)',
        },
        redis: {
          status: redisStatus,
          provider: 'Redis 7',
        },
      },
      system: {
        environment: process.env.NODE_ENV || 'production',
        nodeVersion: process.version,
        memoryUsageMb: {
          rss: Math.round(memory.rss / 1024 / 1024),
          heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
          heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
        },
      },
    };

    return res
      .status(isHealthy ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE)
      .json(responsePayload);
  }
}
