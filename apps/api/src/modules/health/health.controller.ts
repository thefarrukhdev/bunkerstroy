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
    let isHealthy = true;

    // 1. Check PostgreSQL via Prisma (real query ping)
    let dbStatus = 'healthy';
    let dbLatencyMs = 0;
    let dbError: string | undefined;
    const dbStart = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbLatencyMs = Date.now() - dbStart;
    } catch (err: any) {
      dbLatencyMs = Date.now() - dbStart;
      dbStatus = 'unhealthy';
      dbError = err?.message || 'DB query failed';
      isHealthy = false;
    }

    // 2. Check Redis (real PING command, no fake memory fallback masking)
    let redisStatus = 'healthy';
    let redisLatencyMs = 0;
    let redisError: string | undefined;
    const redisCheck = await this.redis.pingWithDetails();
    redisLatencyMs = redisCheck.latencyMs;

    if (redisCheck.healthy) {
      redisStatus = 'healthy';
    } else {
      redisStatus = 'unhealthy';
      redisError = redisCheck.error || 'Redis connection unreachable';
      isHealthy = false;
    }

    const totalLatencyMs = Date.now() - startTime;
    const memory = process.memoryUsage();

    const responsePayload = {
      status: isHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      latencyMs: totalLatencyMs,
      services: {
        database: {
          status: dbStatus,
          provider: 'PostgreSQL 16 (PostGIS)',
          latencyMs: dbLatencyMs,
          ...(dbError ? { error: dbError } : {}),
        },
        redis: {
          status: redisStatus,
          provider: 'Redis 7',
          latencyMs: redisLatencyMs,
          fallbackActive: this.redis.isUsingMemoryFallback(),
          ...(redisError ? { error: redisError } : {}),
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

  @Get('liveness')
  @ApiOperation({ summary: 'Liveness probe tekshiruvi' })
  livenessProbe(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({ status: 'alive' });
  }

  @Get('readiness')
  @ApiOperation({ summary: 'Readiness probe tekshiruvi' })
  async readinessProbe(@Res() res: Response) {
    return this.checkHealth(res);
  }
}
